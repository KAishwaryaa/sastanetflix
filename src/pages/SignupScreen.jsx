import React, { useRef } from "react";
import "./SignupScreen.css";
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, setDoc, doc } from "../mockAuth";

function SignupScreen() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const nameRef = useRef(null);
    const phoneRef = useRef(null);

    const register = async (e) => {
        e.preventDefault();

        try {
            const authUser = await createUserWithEmailAndPassword(
                auth,
                emailRef.current.value,
                passwordRef.current.value
            );

            // Save additional user details to Firestore (Mock)
            await setDoc(doc(db, "users", authUser.user.uid), {
                uid: authUser.user.uid,
                uname: nameRef.current.value,
                email: authUser.user.email,
                phone: phoneRef.current.value,
                // password: passwordRef.current.value // Storing raw passwords is not recommended
            });

            console.log(authUser);
        } catch (error) {
            alert(error.message);
        }
    };

    const signIn = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(
            auth,
            emailRef.current.value,
            passwordRef.current.value
        ).then((authUser) => {
            console.log(authUser);
        }).catch(error => {
            alert(error.message);
        })
    };

    return (
        <div className="signupScreen">
            <form>
                <h1>Sign In</h1>
                <input ref={nameRef} placeholder="Full Name" type="text" />
                <input ref={phoneRef} placeholder="Phone Number" type="tel" />
                <input ref={emailRef} placeholder="Email" type="email" />
                <input ref={passwordRef} placeholder="Password" type="password" />
                <button type="submit" onClick={signIn}>
                    Sign In
                </button>
                <h4>
                    <span className="signupScreen__gray">New to Netflix? </span>
                    <span className="signupScreen__link" onClick={register}>
                        Sign Up now.
                    </span>
                </h4>
            </form>
        </div>
    );
}

export default SignupScreen;
