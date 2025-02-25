import { useState } from "react";
import { useRouter } from "next/router";
import styles from '@/styles/Login.module.css';
import Link from 'next/link';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Please enter both username and password.");
            return; // Stop further execution if validation fails
        }

        const response = await fetch("api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("fullName", data.user?.fullName);
            router.push("/my-tasks");
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <>
            <div className={styles.page}>
                <div className={styles.triangle} />
                <div className={styles.triangle} />
                <div className={styles.triangle} />
                <div className={styles.triangle} />
                <div className={styles.triangle} />
                <div className={styles.triangleBig} />
                
                <div className={styles.logo}><img src="/logo/logo-name.png" alt="Logo" /></div>

                <div className={styles.container}>
                    <div className={styles.promoTextContainer}>
                        <div className={styles.promoText}>
                            <h2><strong>Streamline your team's workflow</strong> with our intuitive project management platform—track tasks, manage sprints, and stay on top of deadlines with ease!</h2>
                        </div>
                    </div>
                    <div className={styles.formContainer}>
                        <h2 className={styles.title}>Welcome back to Daily&lsquo;s!</h2>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                        <Link href=""><div className={styles.linkGrey}>Reset password</div></Link>
                        <button onClick={handleLogin} className={styles.button}>Sign In</button>
                        <span>Don&apos;t have an account? <Link href="/register"><span className={styles.link}>Sign Up</span></Link></span>
                        {error && <p className={styles.error}><small>{error}</small></p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
