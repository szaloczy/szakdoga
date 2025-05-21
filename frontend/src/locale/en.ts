import { NestedI18n } from "../types";

export const en: NestedI18n = {
    role: {
        student: {
            text: 'Student'
        },
        mentor: {
            text: 'Mentor'
        },
        admin: {
            text : 'Admin'
        }
    },
    register: {
        form: {
            title: {
                text: "create an account"
            },
            placeholder: {
                firstname: {
                    text: "Jhon"
                },
                lastname: {
                    text: "Doe"
                },
                email: {
                    text: "Your Email"
                },
                password: {
                    text: "Password"
                },
                confirmPassword: {
                    text: "Confirm Password"
                }
            },
            terms: {
                statements: {
                    text: "I agree all statements in"
                },
                link: {
                    text: "Terms of service"
                }
            },
            button: {
                text: "Sign up"
            },
            registered: {
                question: {
                    text: "Have already an account?"
                },
                link: {
                    text: "Login here"
                }
            }
        }
    },
    login: {
        form: {
            title: {
                text: "Login"
            },
            placeholder: {
                email: {
                    text: "Email"
                },
                password: {
                    text: "Password"
                },
            },
            button: {
                text: "Login"
            },
            registered: {
                question: {
                    text: "Dont have an account?"
                },
                link: {
                    text: "Register here"
                }
            }
        }
    },
    error_message: {
        firstname_required: {
            text: "*Firstname field is required"
        },
        lastname_required: {
            text: "*Lastname field is required"
        },
        email_required: {
            text: "*Email field is required"
        },
        password_required: {
            text: "*Password field is required"
        },
        terms_required: {
            text: "*Trems must be accepted"
        }
    },
    navbar: {
        title: {
            text: "Internship tracker"
        },
        search: {
            text: "Search"
        }
    },
    sidenav: {
        items: {
            dashboard: {
                text: "Dashboard"
            },
            profile: {
                text: "Profile"
            },
            completed_hours: {
                text: "Completed Hours"
            },
            documents: {
                text: "Documents"
            },
            statistics: {
                text: "Statistics"
            }
        },
        logout_button: {
            text: "Exit"
        }
    },
    dashboard: {
        title: {
            text: "Welcome, "
        }
    },
    admin_panel: {
        dashboard: {
            title: {
                text: "Admin panel"
            },
            cards: {
                users: {
                    text: "Users"
                },
                mentors: {
                    text: "Mentors"
                },
                companies: {
                    text: "Companies"
                },
                statistics: {
                    text: "Statistics"
                },
                button: {
                    text: "Manage"
                },
            }
        },
        user_management: {

        }
    }
}