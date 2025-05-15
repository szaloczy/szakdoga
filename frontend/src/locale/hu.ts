import { NestedI18n } from "../types";

export const hu: NestedI18n = {
    register: {
        form: {
            title: {
                text: 'fiók létrehozása'
            },
            placeholder: {
                firstname: {
                    text: 'András'
                },
                lastname: {
                    text: 'Kovács'
                },
                email: {
                    text: 'Email cím'
                },
                password: {
                    text: 'Jelszó'
                },
                confirmPassword: {
                    text: 'Jelszó megerősítése'
                }
            },
            terms: {
                statements: {
                    text: 'Egyetértek minden feltétellel az'
                },
                link: {
                    text: 'Adatkezelési szabályzatban'
                }
            },
            button: {
                text: 'Létrehozás'
            },
            registered: {
                question: {
                    text: 'Már regisztrált?'
                },
                link: {
                    text: 'Bejelentkezés'
                }
            }
        }
    },
    login: {
        form: {
            title: {
                text: 'Bejelentkezés'
            },
            placeholder: {
                email: {
                    text: 'Email cím'
                },
                password: {
                    text: 'Jelszó'
                },
            },
            button: {
                text: "Belépés"
            },
            registered: {
                question: {
                    text: 'Nincs még fiókod?'
                },
                link: {
                    text: 'Regisztráció'
                }
            }
        }
    }
}