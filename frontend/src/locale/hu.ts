export default {
    reset_password: {
        error: {
            invalid_data_or_token: 'Hibás adatok vagy hiányzó token.',
            passwords_mismatch: 'A két jelszó nem egyezik meg!',
            unknown: 'Ismeretlen hiba.'
        },
        success: 'Új jelszó sikeresen beállítva!'
    }
};
import { NestedI18n } from "../types";

export const hu: NestedI18n = {
    common: {
        yes: { text: 'Igen' },
        no: { text: 'Nem' }
    },
    role: {
        student: {
            text: 'Hallgató'
        },
        mentor: {
            text: 'Mentor'
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
            },
            forgot_password: {
                text: "Elfelejtett jelszó?"
            },
            success: {
                text: "Sikeres bejelentkezés"
            }
            },
            forgot_password_form: {
                title: {
                    text: "Jelszó visszaállítása"
                },
                description: {
                    text: "Adja meg az e-mail címét, és elküldjük Önnek a jelszó visszaállításához szükséges linket."
                },
                placeholder: {
                    text: "Adja meg az e-mail címét"
                },
            },
            reset_password_form: {
                title: { text: "Jelszó visszaállítása" },
                placeholder: { text: "Új jelszó" },
                placeholder_again: { text: "Új jelszó újra" },
                button: { text: "Új jelszó beállítása" },
                errors: {
                    passwords_mismatch: { text: "A jelszavak nem egyeznek" },
                    minlength: { text: "A jelszónak legalább 5 karakter hosszúnak kell lennie" }
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
        },  
    },
    response: {
        hour_created: {
            text: "Új óra sikeresen rögzítve"
        },
        hour_invalid: {
            text: "Hiba az óra rögzítésnél"
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
            },
            students: {
                text: "Hallgatók"
            }
        },
        logout_button: {
            text: "Kijelentkezés"
        }
    },
    dashboard: {
        title: { text: "Üdvözlünk, " },
        loading: { text: "Betöltés..." },
        student: {
            upload_documents: { text: "Dokumentumok feltöltése" },
            add_internship: { text: "Új gyakorlat rögzítése" },
            previous_internships: { text: "Korábbi gyakorlatok" },
            major: { text: "Szak" },
            personal_data: { text: "Személyes adatok" },
            name: { text: "Név" },
            neptun: { text: "Neptun kód" },
            university: { text: "Egyetem" },
            phone: { text: "Telefonszám" },
            internship_info: { text: "Gyakornoki információk" },
            company: { text: "Cég" },
            mentor: { text: "Mentor" },
            period: { text: "Időszak" },
            status: { text: "Státusz" },
            approved: { text: "Jóváhagyva" },
            pending: { text: "Függőben" },
            rejected: { text: "Elutasítva" },
            hours_summary: { text: "Órák összesítése" },
            approved_hours: { text: "Jóváhagyott órák" },
            pending_hours: { text: "Függő órák" },
            rejected_hours: { text: "Elutasított órák" },
            total_hours: { text: "Összes óra" },
            progress_statistics: { text: "Haladás Statisztikák" },
            completed_hours: { text: "Teljesített órák" },
            completed_weeks: { text: "Teljesített hetek" },
            remaining_hours: { text: "Hátralevő órák" },
            remaining_weeks: { text: "Hátralevő hetek" },
            progress_status: { text: "Előrehaladás" },
            completed_vs_required_hours: { text: "Teljesített / Szükséges órák" },
            uploaded_documents: { text: "Feltöltött dokumentumok" },
            note: { text: "Megjegyzés" }
        },
        mentor: {
            company_info: { text: "Cég információk" },
            company_name: { text: "Cég neve" },
            position: { text: "Pozíció" },
            city: { text: "Város" },
            email: { text: "Email" },
            quick_actions: { text: "Gyors műveletek" },
            recent_students_activity: { text: "Legutóbbi hallgatói aktivitás" },
            university_not_provided: { text: "Egyetem nincs megadva" },
            hours_count: { text: "Órák száma" },
            pending_approval: { text: "Jóváhagyásra vár" },
            up_to_date: { text: "Naprakész" },
            view_all_students: { text: "Összes hallgató megtekintése" },
            no_students_assigned: { text: "Még nincsenek hozzárendelt hallgatók." },
            approve_hour: { text: "Óra jóváhagyása" },
            upload_documents: { text: "Dokumentumok feltöltése" },
        }
    },
    profile: {
        student_info: {
            title: { text: "Hallgatói információk" },
            internship: { text: "Gyakorlat" },
            status: { text: "Státusz" },
            approved: { text: "Jóváhagyva" },
            pending: { text: "Függőben" },
            no_active_internship: { text: "Nincs aktív gyakorlat" }
        },
        student_details: {
            title: { text: "Hallgatói adatok" },
            firstname: { text: "Keresztnév" },
            lastname: { text: "Vezetéknév" },
            phone: { text: "Telefonszám" },
            email: { text: "Email cím" },
            university: { text: "Egyetem" },
            major: { text: "Szak" },
            neptun: { text: "Neptun kód" },
            optional: { text: "opcionális" },
            unsaved_changes: { text: "Vannak mentetlen módosítások. Mentsd vagy állítsd vissza a folytatáshoz." },
            placeholder: {
                firstname: { text: "Keresztnév" },
                lastname: { text: "Vezetéknév" },
                phone: { text: "Telefonszám" },
                email: { text: "Email cím" },
                uni: { text: "Egyetem" },
                major: { text: "Szak" },
                neptun: { text: "Neptun kód" }
            }
        },
        mentor_details: {
            title: { text: "Mentor adatok" },
            firstname: { text: "Keresztnév" },
            lastname: { text: "Vezetéknév" },
            position: { text: "Beosztás" },
            email: { text: "Email" },
            company: { text: "Cég" },
            company_location: { text: "Cég település" },
            company_address: { text: "Cég cím" },
            company_contact: { text: "Cég elérhetőség" },
            quick_actions: { text: "Gyors műveletek" },
            contact_company: { text: "Cég email küldése" },
            view_stats: { text: "Statisztikák megtekintése" },
            role_info: { text: "Szerepkör információ" },
            mentor_id: { text: "Mentor ID" },
            status: { text: "Státusz" },
            active: { text: "Aktív" },
            inactive: { text: "Inaktív" },
            company_status: { text: "Cég státusz" },
            open_in_maps: { text: "Megnyitás térképen" },
            copy_email: { text: "Email másolása" },
            copy_phone: { text: "Telefonszám másolása" }
        },
        company_details: {
            title: { text: "Céges adatok" },
            start_date: { text: "Kezdés dátuma" },
            end_date: { text: "Befejezés dátuma" },
            message: {
                data: { text: "Az adatok az admin által jóváhagyott gyakorlathoz tartoznak, nem módosíthatók." },
                no_data: { text: "Még nincs jóváhagyott gyakorlati adat." }
            },
            placeholder: {
                company_name: { text: "Cég neve" },
                mentor_name: { text: "Mentor neve" },
                company_email: { text: "Cég email címe" },
                mentor_email: { text: "Mentor email címe" },
                city: { text: "Település" },
                company_address: { text: "Cím" }
            }
        },
        reset_password: {
            title: { text: "Jelszó módosítása" },
        }
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
        },
        no_internship: {
            text: "Nem tudsz órát regisztrálni amíg nincs jóváhagyott gyakorlati helyed"
        },
        messages: {
            delete_hour: {
                success: {
                    text: "Óra sikeresen törölve"
                },
                failed: {
                    text: "Törlés sikertelen"
                }
            },
            update_hour: {
                success: {
                    text: "Óra sikeresen frissítve"
                },
                failed: {
                    text: "Frissítés sikertelen"
                }
            }
        },
        stats: {
            approved: { text: "Jóváhagyott órák" },
            pending: { text: "Függő órák" },
            rejected: { text: "Elutasított órák" },
            total: { text: "Összes óra" },
            left: { text: "Hátralévő órák" }
        },
        tabs: {
            week: { text: "Heti nézet" },
            approved: { text: "Jóváhagyott órák" },
            pending: { text: "Függő órák" },
            rejected: { text: "Elutasított órák" }
        },
        filters: {
            search_placeholder: { text: "Leírás keresése..." },
            clear: { text: "Törlés" }
        },
        actions: {
            refresh: { text: "Frissítés" },
            export_csv: { text: "Exportálás CSV-be" },
            add_hour: { text: "Óra hozzáadása" },
            try_again: { text: "Újra" },
            edit: { text: "Szerkesztés" },
            approve: { text: "Jóváhagyás" },
            reject: { text: "Elutasítás" },
        },
        loading: { text: "Gyakorlati órák betöltése..." },
        entries: {
            showing: { text: "Megjelenítve" },
            of: { text: "a" },
            entries: { text: "bejegyzésből" },
            total: { text: "összesen" },
            filters_applied: { text: "Szűrők aktívak" },
            no_entries_found: { text: "Nincs találat" },
            try_adjusting_filters: { text: "Próbálja módosítani a szűrőket vagy törölje őket." },
            no_hours_yet: { text: "Nincs még {{tab}} gyakorlati óra." },
            hours_entries: { text: "Hallgató rögzített óráinak listája" },

        }
    },
    mentor_students: {
        filters:{
            by_status:{
                all: { text: "Összes diák" },
                active: { text: "Aktív" },
                pending: { text: "Függő" },
                completed: { text: "Teljesített" }
            }
        },
        sorting:{
            sort_by_name: { text: "Rendezés név szerint" },
            sort_by_hours: { text: "Rendezés órák szerint" },
            sort_by_university: { text: "Rendezés egyetem szerint" },
            sort_by_status: { text: "Rendezés státusz szerint" }
        },
        actions: {
            view_hours: { text: "Órák megtekintése" },
            approve_hours: { text: "Órák jóváhagyása" },
            reject_hours: { text: "Órák elutasítása" }
        },
        label: {
            no_pending_hours: { text: "Minden óra jóváhagyva" }
        },
        export: {
            to_csv: { text: "Exportálás CSV-be" }
        }
    },
    document_upload: {
        title: { text: "Dokumentum feltöltése (PDF)" },
        upload_section: {
            title: { text: "Dokumentumok feltöltése (PDF)" },
            select_file: { text: "Fájl kiválasztása" },
            no_file: { text: "Nincs fájl kiválasztva" },
            upload_button: { text: "Feltöltés" },
            uploading: { text: "Feltöltés folyamatban..." },
            success: { text: "Fájl sikeresen feltöltve!" },
            error: { text: "Hiba a fájl feltöltésekor. Kérjük, próbálja újra." },
            invalid_file: { text: "Érvénytelen fájltípus. Kérjük, töltsön fel egy PDF-et." }
        },
        documents_section: {
            title: { text: "Feltöltött dokumentumok" },
            no_documents: { text: "Még nincs feltöltött dokumentum." },
        },
        upload_error: {
            error1: {
                text: "Csak PDF fájlok tölthetők fel!"
            },
            error2: {
                text: "A fájl mérete maximum 10MB lehet!"
            },
            error3: {
                text: "A fájl feltöltése sikertelen. Kérjük, próbálja újra."
            }
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
                documents: {
                    text: "Dokumentumok"
                }
            },
            descriptions: {
                user_desc: {
                    text: "Regisztrált felhasználók kezelése"
                },
                companies_desc: {
                    text: "Cégek hozzáadása és szerkesztése"
                },
                internship_desc: {
                    text: "Gyakorlatok létrehozása és jóváhagyása"
                },
                document_desc: {
                    text: "Feltöltött dokumentumok kezelése"
                }
            }
        },
        user_management: {
            title: {
                text: "Felhasználók kezelése"
            },
            buttons: {
                add_student: { text: "Hallgató hozzáadása" },
                add_mentor: { text: "Mentor hozzáadása" },
                back_to_dashboard: { text: "Vissza a kezdőlapra" }
            },
            table_headers: {
                name: { text: "Név" },
                email: { text: "Email" },
                role: { text: "Szerep" },
                status: { text: "Státusz" },
                actions: { text: "Műveletek" }
            },
            add_student_form: {
                title: { text: "Új hallgató hozzáadása" },
                firstname: { text: "Keresztnév" },
                lastname: { text: "Vezetéknév" },
                email: { text: "Email" },
                active: { text: "Aktív" },
            },
            add_mentor_form: {
                title: { text: "Új mentor hozzáadása" },
                firstname: { text: "Keresztnév" },
                lastname: { text: "Vezetéknév" },
                password: { text: "Jelszó" },
                position: { text: "Beosztás" },
                email: { text: "Email" },
                company: { text: "Cég" },
                active: { text: "Aktív" },
                inactive: { text: "Inaktív" }
            },
        },
        company_management: {
            title: {
                text: "Cégek kezelés"
            },
            buttons: {
                add_company: { text: "Cég hozzáadása" },
                back_to_dashboard: { text: "Vissza a kezdőlapra" }
            },
            table_headers: {
                name: { text: "Cég neve" },
                city: { text: "Város" },
                address: { text: "Cím" },
                active: { text: "Aktív" },
                actions: { text: "Műveletek" }
            }
        },
         internship_management: {
            title: {
                text: "Gyakorlatok kezelése"
            },
            buttons: {
                add_internship: { text: "Gyakorlat hozzáadása" },
                back_to_dashboard: { text: "Vissza a kezdőlapra" }
            },
            table_headers: {
                student: { text: "Hallgató" },
                mentor: { text: "Mentor" },
                company: { text: "Cég" },
                start_date: { text: "Kezdési dátum" },
                is_approved: { text: "Jóváhagyási státusz" },
                actions: { text: "Műveletek" }
            },
            form: {
                title: { text: "Új gyakorlat hozzáadása" },
                student: { text: "Hallgató kiválasztása" },
                mentor: { text: "Mentor kiválasztása" },
                company: { text: "Cég kiválasztása" },
                start_date: { text: "Kezdési dátum" },
                end_date: { text: "Befejezési dátum" },
                is_approved: { text: "Jóváhagyási státusz" },
                options: {
                    approved: { text: "Jóváhagy" },
                    not_approved: { text: "Elutasít" }
                }
            }
        },
        document_management: {
            title: {
                text: "Dokumentum kezelés"
            },
            table_headers: {
                uploader: {
                    text: "Feltöltő"
                },
                document_name: {
                    text: "Dokumentum neve"
                },
                upload_date: {
                    text: "Feltöltés dátuma"
                },
                status: {
                    text: "Státusz"
                },
                actions: {
                    text: "Műveletek"
                }
            },
            states: {
                pending: {
                    text: "Függőben"
                },
                approved: {
                    text: "Jóváhagyva"
                },
                rejected: {
                    text: "Elutasítva"
                }
            },
            actions: {
                approve: {
                    text: "Jóváhagyás"
                },
                reject: {
                    text: "Elutasítás"
                },
                download: {
                    text: "Letöltés"
                }
            }
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
            },
            submit: {
                text: "Küldés"
            },
            choose_file: {
                text: "Fájl kiválasztása"
            },
            edit: {
                text: "Szerkesztés"
            },
            delete: {
                text: "Törlés"
            },
            document_upload: {
                upload_section: {
                    choose_file: { text: 'Fájl kiválasztása' },
                    no_file: { text: 'Nincs fájl kiválasztva' }
                }
            },
        }
    },
    students: {
        page: {
            title: {
                text: "Hallgatóim"
            }
        },
        search: {
            placeholder: {
                text: "Keresés név vagy egyetem alapján..."
            }
        },
        stats: {
            total: {
                text: "Összes Hallgató"
            },
            completed: {
                text: "Befejezett"
            },
            pending: {
                text: "Jóváhagyásra vár"
            },
            active: {
                text: "Aktív"
            }
        },
        status: {
            pending_approval: {
                text: "Függőben"
            },
            completed: {
                text: "Befejezett"
            },
            active: {
                text: "Aktív"
            },
            unknown: {
                text: "Ismeretlen"
            }
        },
        card: {
            university: {
                text: "Egyetem"
            },
            major: {
                text: "Szak"
            },
            completed_hours: {
                text: "Teljesített"
            },
            pending_hours: {
                text: "Függőben"
            },
            progress: {
                text: "Haladás"
            }
        },
        actions: {
            refresh: {
                text: "Frissítés"
            },
            view_details: {
                text: "Részletek"
            },
            approve_hours: {
                text: "Órák jóváhagyása"
            },
            clear_search: {
                text: "Keresés törlése"
            }
        },
        loading: {
            text: "Hallgatók betöltése..."
        },
        empty: {
            no_students: {
                text: "Nincsenek Hallgatók"
            },
            no_students_desc: {
                text: "Még nincsenek hozzád rendelt hallgatók."
            },
            no_results: {
                text: "Nincs Találat"
            },
            no_results_desc: {
                text: "Nincs olyan hallgató, aki megfelelne a keresési feltételeknek."
            }
        }
    },
    statistics: {
        title: { text: "Statisztikák" },
        charts: {
            pie: { text: "Órák állapot szerint" },
            candle: { text: "Órák havi bontásban" },
            line: { text: "Kumulált órák" },
        },
        candle: {
            hours_per_month: { text: "Gyakornoki órák havonta" }
        },
        pie: {
            hour_status: { text: "Órák állapot szerint" }
        },
        loading: { text: "Statisztikák betöltése..." },
        no_data: { text: "Nincs elérhető adat a statisztikákhoz." }
    },
    days: {
        mon: { text: 'Hétfő' },
        tue: { text: 'Kedd' },
        wed: { text: 'Szerda' },
        thu: { text: 'Csütörtök' },
        fri: { text: 'Péntek' },
        sat: { text: 'Szombat' },
        sun: { text: 'Vasárnap' },
    },
    time: {
        hour: { text: 'óra' },
        minute: { text: 'perc' },
    },
    be_response: {
        common: {
            student_not_found: { text: "Hallgató nem található." },
            hour_entry_not_found: { text: "Óra bejegyzés nem található." },
            mentor_not_found: { text: "Mentor nem található." }
        },
        create_hour: {
            no_approved_internship: { text: "Ennek a hallgatónak nincs jóváhagyott gyakornoki helye." },
            future_date_not_allowed: { text: "Nem lehet jövőbeli dátumot megadni a gyakornoki órához." },
            start_time_must_be_earlier: { text: "A kezdési időpontnak korábbinak kell lennie, mint a befejezési időpont." },
            date_out_of_internship_period: { text: "A gyakornoki óra dátumának a gyakornoki időszakon belül kell lennie." },
            only_8_hours_per_day_allowed: { text: "Naponta legfeljebb 8 órát lehet rögzíteni." }
        },
        update_hour: {
            only_own_entry_update: { text: "Csak a saját óra bejegyzéseidet frissítheted." },
            only_pending_update: { text: "Csak a függőben lévő óra bejegyzéseket frissítheted." }
        },
        delete_hour: {
            only_own_entry_delete: { text: "Csak a saját óra bejegyzéseidet törölheted." },
            only_pending_delete: { text: "Csak a függőben lévő óra bejegyzéseket törölheted." }
        },
        approve_hour: {
            only_own_students: { text: "Csak a saját hallgatóid óráit hagyhatod jóvá." },
            only_pending_approve: { text: "Csak a függőben lévő óra bejegyzéseket hagyhatod jóvá." }
        },
        reject_hour: {
            only_own_students: { text: "Csak a saját hallgatóid óráit utasíthatod el." },
            only_pending_reject: { text: "Csak a függőben lévő óra bejegyzéseket utasíthatod el." }
        },
        bulk_approve: {
            no_hours_found_by_ids: { text: "Nincs óra a megadott azonosítókkal." },
            only_own_students: { text: "Csak a saját hallgatóid óráit hagyhatod jóvá." },
            no_pending_hours: { text: "Nincs függőben lévő óra, amit jóváhagyhatnál." }
        },
        approve_all: {
            no_approved_internship_for_student: { text: "Nincs jóváhagyott gyakornoki helye ennek a hallgatónak a te mentorálásod alatt." },
            no_pending_hours_for_student: { text: "Nincs függőben lévő óra ennek a hallgatónak." }
        },
        reject_all: {
            no_approved_internship_for_student: { text: "Nincs jóváhagyott gyakornoki helye ennek a hallgatónak a te mentorálásod alatt." },
            no_pending_hours_for_student: { text: "Nincs függőben lévő óra ennek a hallgatónak." }
        }
    }
}