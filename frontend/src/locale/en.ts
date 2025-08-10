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
    response: {
        hour_created: {
            text: "New hour saved successfully"
        },
        hour_invalid: {
            text: "Error during hour creation"
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
                text: "Add new hour"
            },
            documents: {
                text: "Documents"
            },
            statistics: {
                text: "Statistics"
            },
            students: {
                text: "Students"
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
    profile: {
        student_details: {
            title: {
                text: "Student details"
            },
            placeholder: {
                firstname: {
                    text: "Firstname"
                },
                lastname: {
                    text: "Lastname"
                },
                phone: {
                    text: "Phone"
                },
                email: {
                    text: "Email"
                },
                uni: {
                    text: "University"
                },
                major: {
                    text: "Major"
                },
                neptun: {
                    text: "Neptun"
                }
            }
        },
        mentor_details: {
            title: {
                text: "Mentor details"
            },
            placeholder: {
                firstname: {
                    text: "Firstname"
                },
                lastname: {
                    text: "Lastname"
                },
                phone: {
                    text: "Phone"
                },
                email: {
                    text: "Email"
                },
                company: {
                    text: "Company"
                },
                role: {
                    text: "Role"
                },
            }
        },
        company_details: {
            title: {
                text: "Internship details"
            },
            placeholder: {
                company_name: {
                    text: "Company name"
                },
                mentor_name: {
                    text: "Mentor"
                },
                company_address: {
                    text: "Address"
                },
                company_email: {
                    text: "Company email"
                },
                mentor_email: {
                    text: "Mentor email"
                },
                city: {
                    text: "City"
                }
            },
            message: {
                data: {
                    text: "The data belongs to the practice approved by the admin and cannot be modified."
                },
                no_date: {
                    text: "There is no approved internship yet."
                }
            }
        }
    },
    internship_hours:{
        title: {
            text: "Internship hours"
        },
        add_hour: {
            text: "Add hour"
        },
        add_hour_box: {
            title: {
                text: "Add new hour"
            },
            start: {
                text: "Start Time"
            },
            end: {
                text: "End Time"
            },
            desc: {
                text: "Description"
            },
        },
        zero_hour: {
            text: "No saved hours found for this day"
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
                companies: {
                    text: "Companies"
                },
                internships: {
                    text: "Internships"
                },
                button: {
                    text: "Manage"
                },
            }
        },
        user_management: {

        }
    },
    buttons: {
        forms: {
            cancel: {
                text: "Cancel"
            },
            save: {
                text: "Save"
            },
            reset: {
                text: "Reset"
            }
        }
    },
    students: {
        page: {
            title: {
                text: "My Students"
            }
        },
        search: {
            placeholder: {
                text: "Search by name or university..."
            }
        },
        stats: {
            total: {
                text: "Total Students"
            },
            completed: {
                text: "Completed"
            },
            pending: {
                text: "Pending Approval"
            },
            active: {
                text: "Active"
            }
        },
        status: {
            pending_approval: {
                text: "Pending"
            },
            completed: {
                text: "Completed"
            },
            active: {
                text: "Active"
            },
            unknown: {
                text: "Unknown"
            }
        },
        card: {
            university: {
                text: "University"
            },
            major: {
                text: "Major"
            },
            completed_hours: {
                text: "Completed"
            },
            pending_hours: {
                text: "Pending"
            },
            progress: {
                text: "Progress"
            }
        },
        actions: {
            refresh: {
                text: "Refresh"
            },
            view_details: {
                text: "View Details"
            },
            approve_hours: {
                text: "Approve Hours"
            },
            clear_search: {
                text: "Clear Search"
            }
        },
        loading: {
            text: "Loading students..."
        },
        empty: {
            no_students: {
                text: "No Students Found"
            },
            no_students_desc: {
                text: "You don't have any assigned students yet."
            },
            no_results: {
                text: "No Search Results"
            },
            no_results_desc: {
                text: "No students match your search criteria."
            }
        }
    }
}