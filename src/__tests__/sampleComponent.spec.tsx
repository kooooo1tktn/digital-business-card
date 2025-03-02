import { render, screen } from "@testing-library/react";
import  App from "../App";

describe("App コンポーネント", () => {
  it("タイトルを見ることができる", () => {
    render (<App />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
