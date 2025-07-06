import { NestedI18n } from "../types";

export const hu: NestedI18n = {
    role: {
        student: {
            text: 'Hallgató'
        },
        mentor: {
            text: 'mentor'
        },
        admin: {
            text : 'Adminisztrátor'
        }
    },
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
    },
     error_message: {
        firstname_required: {
            text: "*Keresztnév megadása kötelező"
        },
        lastname_required: {
            text: "*Vezetéknév megadása kötelező"
        },
        email_required: {
            text: "*E-mail cím megadása kötelező"
        },
        password_required: {
            text: "*Jelszó megadása kötelező"
        },
        terms_required: {
            text: "*Feltételek elfogadása szükséges"
        }
    },
    navbar: {
        title: {
            text: "Gyakorlat nyílvántartó"
        },
        search: {
            text: "Keresés"
        }
    },
    sidenav: {
        items: {
            dashboard: {
                text: "Kezdőlap"
            },
            profile: {
                text: "Profil"
            },
            completed_hours: {
                text: "Óra hozzáadása"
            },
            documents: {
                text: "Dokumentumok"
            },
            statistics: {
                text: "Statisztikák"
            }
        },
        logout_button: {
            text: "Kijelentkezés"
        }
    },
    dashboard: {
        title: {
            text: "Üdvözlünk, "
        }
    },
    profile: {
        student_details: {
            title: {
                text: "Hallgatói adatok"
            },
            placeholder: {
                firstname: {
                    text: "Keresztnév"
                },
                lastname: {
                    text: "Vezetéknév"
                },
                phone: {
                    text: "Telefonszám"
                },
                email: {
                    text: "Email cím"
                },
                uni: {
                    text: "Egyetem"
                },
                major: {
                    text: "Szak"
                },
                neptun: {
                    text: "Neptun"
                }
            }
        },
        company_details: {
            title: {
                text: "Céges adatok"
            },
            placeholder: {
                company_name: {
                    text: "Cég neve"
                },
                mentor_name: {
                    text: "Mentor neve"
                },
                company_address: {
                    text: "Cím"
                },
                company_email: {
                    text: "Cég email címe"
                },
                mentor_email: {
                    text: "Mentor email címe"
                },
                city: {
                    text: "Település"
                }
            },
            message: {
                data: {
                    text: "Az adatok az admin által jóváhagyott gyakorlathoz tartoznak, nem módosíthatók."
                },
                no_date: {
                    text: "Még nincs jóváhagyott gyakorlati adat."
                }
            }
    },
    },
    internship_hours:{
        title: {
            text: "Gyakorlati órák"
        },
        add_hour: {
            text: "Óra hozzáadása"
        },
        add_hour_box: {
            title: {
                text: "Új óra hozzáadása"
            },
            start: {
                text: "Kezdés"
            },
            end: {
                text: "Vége"
            },
            desc: {
                text: "Leírás"
            },
        },
        zero_hour: {
            text: "Nincs rögzített óra ehez a naphoz"
        }
    },
    admin_panel: {
        dashboard: {
            title: {
                text: "Admin panel"
            },
            cards: {
                users: {
                    text: "Felhasználók"
                },
                companies: {
                    text: "Cégek"
                },
                internships: {
                    text: "Gyakorlatok"
                },
                button: {
                    text: "Kezelés"
                },
            }
        },
        user_management: {

        }
    },
    buttons: {
        forms: {
            cancel: {
                text: "Mégse"
            },
            save: {
                text: "Mentés"
            },
            reset: {
                text: "Visszaállítás"
            }
        }
    }
}