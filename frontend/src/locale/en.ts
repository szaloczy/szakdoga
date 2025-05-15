import { NestedI18n } from '../types';

export const en: NestedI18n = {
    register: {
        form: {
            title: {
                text: 'create an account'
            },
            placeholder: {
                firstname: {
                    text: 'Jhon'
                },
                lastname: {
                    text: 'Doe'
                },
                email: {
                    text: 'Your Email'
                },
                password: {
                    text: 'Password'
                },
                confirmPassword: {
                    text: 'Confirm Password'
                }
            },
            terms: {
                statements: {
                    text: 'I agree all statements in'
                },
                link: {
                    text: 'Terms of service'
                }
            },
            button: {
                text: 'Sign up'
            },
            registered: {
                question: {
                    text: 'Have already an account?'
                },
                link: {
                    text: 'Login here'
                }
            }
        }
    },
    login: {
        form: {
            title: {
                text: 'Login'
            },
            placeholder: {
                email: {
                    text: 'Email'
                },
                password: {
                    text: 'Password'
                },
            },
            button: {
                text: "Login"
            },
            registered: {
                question: {
                    text: 'Dont have an account?'
                },
                link: {
                    text: 'Register here'
                }
            }
        }
    }
}