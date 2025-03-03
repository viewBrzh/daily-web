import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/ConfirmEmail.module.css";
import LoadingModal from "@/components/common/loadingModa"; // Assuming you have a loading modal component

const ConfirmEmail = () => {
    const router = useRouter();
    const [confirmationStatus, setConfirmationStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { confirmation_url } = router.query;

    useEffect(() => {
        if (!confirmation_url) {
            setConfirmationStatus("No confirmation URL provided.");
            return;
        }

        const confirmationUrlString = Array.isArray(confirmation_url) ? confirmation_url[0] : confirmation_url;
        const handleConfirmEmail = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(confirmationUrlString, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    setConfirmationStatus("Your email has been successfully confirmed!");
                } else {
                    setConfirmationStatus("There was an error confirming your email.");
                }
            } catch (error) {
                setConfirmationStatus("Network error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        handleConfirmEmail();
    }, [confirmation_url]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <img src="/logo/logo-name.png" alt="Logo" className={styles.logo} />
                <h2 className={styles.title}>Email Confirmation</h2>
                <p className={styles.message}>{confirmationStatus}</p>
                <LoadingModal isLoading={isLoading} />
                <button
                    className="btn"
                    onClick={() => router.push("/login")}
                    disabled={isLoading}
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
};

export default ConfirmEmail;
