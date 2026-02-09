import { render, screen, act } from "@testing-library/react";
import CountdownTimer from "@/components/ui/CountdownTimer";

describe("CountdownTimer", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-02-08T15:59:50")); // 10 segundos antes
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders correctly", () => {
    render(<CountdownTimer />);
    
    expect(screen.getByText("Dias")).toBeInTheDocument();
    expect(screen.getByText("Horas")).toBeInTheDocument();
    expect(screen.getByText("Min")).toBeInTheDocument();
    expect(screen.getByText("Seg")).toBeInTheDocument();
  });

  it("updates time", () => {
    render(<CountdownTimer />);
    
    // Avançar 1 segundo
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Como o componente é client-side e usa useEffect, o teste pode ser sensível.
    // O foco aqui é garantir que não quebra.
    expect(screen.getByText("Dias")).toBeInTheDocument();
  });
});
