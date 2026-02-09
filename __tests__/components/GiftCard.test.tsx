import { render, screen, fireEvent } from "@testing-library/react";
import GiftCard from "@/components/ui/GiftCard";

// Mock do presente
const mockPresente = {
  id: "1",
  titulo: "Presente Teste",
  descricao: "Descrição do presente",
  preco: 100,
  imagem_url: "http://example.com/image.jpg",
  categoria: "Teste",
  tipo: "completo" as const,
  valor_arrecadado: 0,
  disponivel: true,
};

describe("GiftCard", () => {
  it("renders correctly", () => {
    render(<GiftCard presente={mockPresente} onSelect={() => {}} index={0} />);
    
    expect(screen.getByText("Presente Teste")).toBeInTheDocument();
    expect(screen.getByText("R$ 100,00")).toBeInTheDocument(); // Intl pode variar espaço non-breaking, verificar
  });

  it("calls onSelect when clicked", () => {
    const handleSelect = jest.fn();
    render(<GiftCard presente={mockPresente} onSelect={handleSelect} index={0} />);
    
    const button = screen.getByText("Presentear");
    fireEvent.click(button);
    
    expect(handleSelect).toHaveBeenCalledWith(mockPresente);
  });

  it("shows unavailable state", () => {
    const unavailableGift = { ...mockPresente, disponivel: false };
    render(<GiftCard presente={unavailableGift} onSelect={() => {}} index={0} />);
    
    expect(screen.getByText("Indisponível")).toBeInTheDocument();
    expect(screen.getByText("Já presenteado")).toBeInTheDocument();
  });
});
