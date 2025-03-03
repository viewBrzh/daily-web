import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/ResetPassword.module.css";
import AlertModal from "@/components/common/modal/alert/alertModal";
import ReturnButton from "@/components/common/button/returnButton";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleReset = async () => {
        if (!email) {
            setError("Please enter your email.");
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("If your email is registered, a password reset link has been sent.");
            } else {
                setError(data.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <ReturnButton 
                    href="/login"
                    isShowBack={true}
                />
                <h2>Reset Your Password</h2>
                <p>Enter your email to receive a password reset link.</p>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                />
                <button onClick={handleReset} className={styles.buttonSubmit} disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send"}
                </button>
                {error && <p className={styles.error}>{error}</p>}

                <AlertModal
                    isShow={!!successMessage}
                    title="Check Your Email"
                    description={successMessage}
                    type="success"
                    onClose={() => {
                        setSuccessMessage("");
                        router.push("/login"); // Redirect after closing modal
                    }}
                />
            </div>
        </div>
    );
};

export default ResetPassword;
