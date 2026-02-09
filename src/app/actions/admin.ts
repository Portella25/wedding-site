'use server'

import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key");

async function checkAuth() {
  const token = (await cookies()).get('admin_token')?.value
  if (!token) throw new Error('Unauthorized')
  try {
    await jwtVerify(token, JWT_SECRET)
  } catch (e) {
    throw new Error('Unauthorized')
  }
}

// --- Guests ---
export async function getGuests() {
  await checkAuth()
  const { data, error } = await supabaseAdmin.from('convidados').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function saveGuest(guest: any) {
  await checkAuth()
  // Remover campos que não são do banco se houver
  const { id, ...data } = guest
  
  if (id) {
    const { error } = await supabaseAdmin.from('convidados').update(data).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabaseAdmin.from('convidados').insert(data)
    if (error) throw new Error(error.message)
  }
  revalidatePath('/admin/guests')
}

export async function deleteGuest(id: string) {
  await checkAuth()
  const { error } = await supabaseAdmin.from('convidados').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/guests')
}

// --- Gifts ---
export async function getGifts() {
    await checkAuth()
    const { data, error } = await supabaseAdmin.from('presentes').select('*').order('created_at')
    if (error) throw new Error(error.message)
    return data
}

export async function saveGift(gift: any) {
    await checkAuth()
    const { id, ...data } = gift
    if (id) {
        const { error } = await supabaseAdmin.from('presentes').update(data).eq('id', id)
        if (error) throw new Error(error.message)
    } else {
        const { error } = await supabaseAdmin.from('presentes').insert(data)
        if (error) throw new Error(error.message)
    }
    revalidatePath('/admin/gifts')
}

export async function deleteGift(id: string) {
    await checkAuth()
    const { error } = await supabaseAdmin.from('presentes').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/gifts')
}

export async function toggleGiftAvailability(id: string, current: boolean) {
    await checkAuth()
    const { error } = await supabaseAdmin.from('presentes').update({ disponivel: !current }).eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/gifts')
}

export async function getTransactions() {
    await checkAuth()
    const { data, error } = await supabaseAdmin
      .from("contribuicoes")
      .select(`*, presentes (titulo), convidados (nome)`)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message)
    return data
}

// --- Settings ---
export async function getSettings() {
    // Leitura de configurações pode ser pública dependendo da policy, mas aqui usamos admin client
    const { data, error } = await supabaseAdmin.from('configuracoes').select('*')
    if (error) throw new Error(error.message)
    return data
}

export async function saveSettings(settings: any) {
    await checkAuth()
    const updates = Object.entries(settings).map(([chave, valor]) => ({
        chave,
        valor,
        updated_at: new Date().toISOString(),
    }));
    const { error } = await supabaseAdmin.from("configuracoes").upsert(updates);
    if (error) throw new Error(error.message)
    revalidatePath('/admin/settings')
}

export async function getHistoryEvents() {
    await checkAuth()
    const { data, error } = await supabaseAdmin.from('historia_eventos').select('*').order('ordem', { ascending: true })
    if (error) return []
    return data || []
}

export async function saveHistoryEvent(event: any) {
    await checkAuth()
    const { id, ...data } = event
    if (id) {
        const { error } = await supabaseAdmin.from('historia_eventos').update(data).eq('id', id)
        if (error) throw new Error(error.message)
    } else {
        const { error } = await supabaseAdmin.from('historia_eventos').insert(data)
        if (error) throw new Error(error.message)
    }
    revalidatePath('/admin/settings')
}

export async function deleteHistoryEvent(id: string) {
    await checkAuth()
    const { error } = await supabaseAdmin.from('historia_eventos').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/settings')
}

export async function reorderHistoryEvents(ids: string[]) {
    await checkAuth()
    for (let i = 0; i < ids.length; i++) {
        const { error } = await supabaseAdmin.from('historia_eventos').update({ ordem: i }).eq('id', ids[i])
        if (error) throw new Error(error.message)
    }
    revalidatePath('/admin/settings')
}
// --- Photos ---
export async function getAdminPhotos(status: string) {
    await checkAuth()
    const { data, error } = await supabaseAdmin
        .from("fotos")
        .select(`*, convidados (nome)`)
        .eq("status", status)
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message)
    return data
}

export async function updatePhotoStatus(id: string, status: string) {
    await checkAuth()
    const { error } = await supabaseAdmin.from("fotos").update({ status }).eq("id", id)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/photos')
}

export async function getAllApprovedPhotos() {
    await checkAuth()
    const { data, error } = await supabaseAdmin.from("fotos").select("url, id").eq("status", "approved")
    if (error) throw new Error(error.message)
    return data
}

// --- Dashboard ---
export async function getDashboardStats() {
    await checkAuth()
    
    const { data: guests } = await supabaseAdmin.from("convidados").select("acompanhantes_confirmados, status_rsvp, acompanhantes_max");
    const { count: pendingPhotos } = await supabaseAdmin.from("fotos").select("*", { count: "exact", head: true }).eq("status", "pending");
    const { data: contributions } = await supabaseAdmin.from("contribuicoes").select("valor").eq("status_pagamento", "pago");

    let confirmed = 0;
    let pending = 0;
    let refused = 0;

    guests?.forEach((g: any) => {
        if (g.status_rsvp === 'confirmado') confirmed += (g.acompanhantes_confirmados || 1);
        else if (g.status_rsvp === 'recusado') refused += 1;
        else pending += (g.acompanhantes_max + 1);
    });

    const raised = contributions?.reduce((acc: number, curr: any) => acc + Number(curr.valor), 0) || 0;

    return {
        confirmedGuests: confirmed,
        pendingGuests: pending,
        refusedGuests: refused,
        pendingPhotos: pendingPhotos || 0,
        totalRaised: raised,
        totalGuests: confirmed + pending + refused,
    };
}
