import { useState } from "react";
import { useRouter } from "next/router";
import styles from '@/styles/Register.module.css';
import Link from "next/link";
import AlertModal from "@/components/common/modal/alert/alertModal";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [nickName, setNickName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const fullName = firstName + " " + lastName + " (" + nickName + ")";

        const response = await fetch("/api/auth/signUp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            setSuccessMessage("Registration successful! Please check your email to verify your account.");
        } else {
            const data = await response.json(); // Check this only if response is not ok
            setError(data.error || "Something went wrong. Please try again.");
        }

    };

    return (
        <div className={styles.page}>
            <div className={styles.triangle} />
            <div className={styles.triangle} />
            <div className={styles.triangle} />
            <div className={styles.triangle} />
            <div className={styles.triangle} />
            <div className={styles.container}>
                <div className={styles.logo}><img src="/logo/logo-name.png" alt="Logo" /></div>
                <div className={styles.ResformContainer}>
                    <div className={styles.promoTextContainer}>
                        <div className={styles.promoImg}>
                            <img src="/promo/promo-img.png" alt="promo" />
                        </div>
                    </div>
                    <div className={styles.fCon}>
                        <div className={styles.formC}>
                            <h2 className={styles.title}>Create Your Account</h2>
                            <div className={styles.name}>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className={styles.input}
                                />
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Nickname"
                                value={nickName}
                                onChange={(e) => setNickName(e.target.value)}
                                className={styles.input}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.input}
                            />
                            <button onClick={handleRegister} className={styles.button}>Sign Up</button>
                            <span>Already have an account? <Link href="/login"> <span className={styles.link}>Log In</span></Link></span>
                            {error && <p className={styles.error}>{error}</p>}
                            {successMessage && <p className={styles.success}>{successMessage}</p>}
                        </div>
                    </div>
                </div>
            </div>
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
    );
};

export default Register;
