import styles from "./index.module.css";
import Image from "next/image";
import mainPic from "../../public/static/images/main.png";
import Link from "next/link";

export default function IndexPage() {
    return (
        <div className={styles.container}>
            <Image className={styles.mainImg} src={mainPic} alt="Index picture for the website" />
            <div className={styles.btnGroup}>
                <Link className={`${styles.signup} ${styles.btn}`} href="/signup">Signup</Link>
                <Link className={`${styles.login} ${styles.btn}`} href="/login">Login</Link>
            </div>
        </div>
    );
}
