import { useState } from "react";
import { useRouter } from "next/router";
import styles from '@/styles/Register.module.css';
import Link from "next/link";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setSuccess("Welcome aboard! Please check your email to verify your account.");
            setTimeout(() => router.push("/login"), 3000);
        } else {
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
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                            {success && <p className={styles.success}>{success}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
