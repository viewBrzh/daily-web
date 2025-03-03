import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/ResetPassword.module.css";
import AlertModal from "@/components/common/modal/alert/alertModal";
import ReturnButton from "@/components/common/button/returnButton";

const UpdatePassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState("");
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromURL = urlParams.get("access_token");
        console.log(tokenFromURL);
        if (!tokenFromURL) {
            setError("Invalid or missing token.");
        } else {
            setToken(tokenFromURL);
        }
    }, []);

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setIsLoading(true);
        setError("");
        setSuccessMessage("");
        try {
            const response = await fetch("/api/auth/update-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ new_password: newPassword, token: token }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Your password has been updated successfully.");
            } else {
                setError(data.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
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
                <h2>Update Your Password</h2>
                <p>Enter your new password below.</p>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.input}
                />
                <button onClick={handleUpdatePassword} className='btn' disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                </button>
                {error && <p className={styles.error}>{error}</p>}

                <AlertModal
                    isShow={!!successMessage}
                    title="Success!"
                    description={successMessage}
                    type="success"
                    onClose={() => {
                        setSuccessMessage("");
                        router.push("/login");
                    }}
                />
            </div>
        </div>
    );
};

export default UpdatePassword;
