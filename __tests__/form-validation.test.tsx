import { act, renderHook } from "@testing-library/react";
import { useFormValidation } from "@/hooks/useFormValidation";

describe("useFormValidation", () => {
  const fields = {
    name: { required: true },
    email: { required: true, email: true },
    message: { required: true, minLength: 10 },
  } as const;

  it("reports required and format errors and blocks submission", async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useFormValidation({ fields, onSubmit })
    );
    const preventDefault = jest.fn();

    await act(async () => {
      await result.current.handleSubmit({ preventDefault } as never);
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors).toEqual({
      name: "Name is required",
      email: "Email is required",
      message: "Message is required",
    });

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "invalid" },
      } as never);
    });
    await act(async () => {
      await result.current.handleSubmit({ preventDefault } as never);
    });

    expect(result.current.errors.email).toBe("Please enter a valid email address");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values and tracks the submitting state", async () => {
    let resolveSubmit: (() => void) | undefined;
    const onSubmit = jest.fn(
      () => new Promise<void>((resolve) => (resolveSubmit = resolve))
    );
    const { result } = renderHook(() =>
      useFormValidation({ fields, onSubmit })
    );

    act(() => {
      result.current.setFieldValue("name", "Jane Donor");
      result.current.setFieldValue("email", "jane@example.com");
      result.current.setFieldValue("message", "Please pray for my family.");
    });

    let submitPromise: Promise<void>;
    await act(async () => {
      submitPromise = result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as never);
      await Promise.resolve();
    });

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Jane Donor",
      email: "jane@example.com",
      message: "Please pray for my family.",
    });
    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      resolveSubmit?.();
      await submitPromise;
    });
    expect(result.current.isSubmitting).toBe(false);
  });
});
