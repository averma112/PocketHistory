import { signIn } from "next-auth/react";

// ...
async function onSubmit(e) {
  e.preventDefault();

  const r = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await r.json();
  if (!r.ok) {
    alert(data?.error || "Signup failed");
    return;
  }

  // Auto-login after signup
  await signIn("credentials", {
    email,
    password,
    callbackUrl: "/dashboard",
    redirect: true,
  });
}
