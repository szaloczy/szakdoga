export default {
    reset_password: {
        error: {
            invalid_data_or_token: 'Invalid data or missing token.',
            passwords_mismatch: 'Passwords do not match!',
            unknown: 'Unknown error.'
        },
        success: 'New password set successfully!'
    }
};
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
        },
        success: {
            text: "Successful registration!"
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
            },
            forgot_password: {
                text: "Forgot password?"
            },
            },
            success: {
                text: "Successful login"
            },
            forgot_password_form: {
                title: {
                    text: "Reset password"
                },
                description: {
                    text: "Enter your email address and we will send you a link to reset your password."
                },
                placeholder: {
                    text: "Enter your email"
                },
            },
            reset_password_form: {
                title: { text: "Reset password" },
                placeholder: { text: "New password" },
                placeholder_again: { text: "New password again" },
                button: { text: "Set new password" },
                errors: {
                    passwords_mismatch: { text: "Passwords do not match" },
                    minlength: { text: "Password must be at least 5 characters long" }
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
        title: { text: "Welcome, " },
        loading: { text: "Loading..." },
        student: {
            upload_documents: { text: "Upload documents" },
            add_internship: { text: "Add new internship" },
            previous_internships: { text: "Previous internships" },
            major: { text: "Major" },
            personal_data: { text: "Personal data" },
            name: { text: "Name" },
            neptun: { text: "Neptun code" },
            university: { text: "University" },
            phone: { text: "Phone" },
            internship_info: { text: "Internship info" },
            company: { text: "Company" },
            mentor: { text: "Mentor" },
            period: { text: "Period" },
            status: { text: "Status" },
            approved: { text: "Approved" },
            pending: { text: "Pending" },
            rejected: { text: "Rejected" },
            hours_summary: { text: "Hours summary" },
            approved_hours: { text: "Approved hours" },
            pending_hours: { text: "Pending hours" },
            rejected_hours: { text: "Rejected hours" },
            total_hours: { text: "Total hours" },
            uploaded_documents: { text: "Uploaded documents" },
            note: { text: "Note" }
        },
        mentor: {
            company_info: { text: "Company info" },
            company_name: { text: "Company name" },
            position: { text: "Position" },
            city: { text: "City" },
            email: { text: "Email" },
            quick_actions: { text: "Quick actions" },
            recent_students_activity: { text: "Recent students activity" },
            university_not_provided: { text: "University not provided" },
            hours_count: { text: "Hours count" },
            pending_approval: { text: "Pending approval" },
            up_to_date: { text: "Up to date" },
            view_all_students: { text: "View all students" },
            no_students_assigned: { text: "No students assigned yet." },
            approve_hour: { text: "Approve hour" },
            upload_documents: { text: "Upload documents" },
        }
    },
    profile: {
        student_info: {
            title: { text: "Student Info" },
            internship: { text: "Internship" },
            status: { text: "Status" },
            approved: { text: "Approved" },
            pending: { text: "Pending" },
            no_active_internship: { text: "No active internship" }
        },
        student_details: {
            title: { text: "Student details" },
            firstname: { text: "First Name" },
            lastname: { text: "Last Name" },
            phone: { text: "Phone" },
            email: { text: "Email" },
            university: { text: "University" },
            major: { text: "Major" },
            neptun: { text: "Neptun Code" },
            optional: { text: "optional" },
            unsaved_changes: { text: "You have unsaved changes. Please save or reset to continue." },
            placeholder: {
                firstname: { text: "First Name" },
                lastname: { text: "Last Name" },
                phone: { text: "Phone" },
                email: { text: "Email" },
                uni: { text: "University" },
                major: { text: "Major" },
                neptun: { text: "Neptun Code" }
            }
        },
        mentor_details: {
            title: { text: "Mentor details" },
            firstname: { text: "First Name" },
            lastname: { text: "Last Name" },
            position: { text: "Position" },
            email: { text: "Email" },
            company: { text: "Company" },
            company_location: { text: "Company Location" },
            company_address: { text: "Company Address" },
            company_contact: { text: "Company Contact" },
            quick_actions: { text: "Quick Actions" },
            contact_company: { text: "Contact Company" },
            view_stats: { text: "View Stats" },
            role_info: { text: "Role Information" },
            mentor_id: { text: "Mentor ID" },
            status: { text: "Status" },
            active: { text: "Active" },
            inactive: { text: "Inactive" },
            company_status: { text: "Company Status" },
            open_in_maps: { text: "Open in maps" },
            copy_email: { text: "Copy email" },
            copy_phone: { text: "Copy phone" }
        },
        company_details: {
            title: { text: "Company details" },
            start_date: { text: "Start Date" },
            end_date: { text: "End Date" },
            message: {
                data: { text: "The data belongs to the practice approved by the admin and cannot be modified." },
                no_data: { text: "There is no approved internship yet." }
            },
            placeholder: {
                company_name: { text: "Company name" },
                mentor_name: { text: "Mentor name" },
                company_email: { text: "Company email" },
                mentor_email: { text: "Mentor email" },
                city: { text: "City" },
                company_address: { text: "Address" }
            }
        },
        reset_password: {
            title: { text: "Modify Password" },
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
        },
        stats: {
            approved: { text: "Approved Hours" },
            pending: { text: "Pending Hours" },
            rejected: { text: "Rejected Hours" },
            total: { text: "Total Hours" },
            left: { text: "Hours Left" }
        },
        tabs: {
            week: { text: "Week View" },
            approved: { text: "Approved Hours" },
            pending: { text: "Pending Hours" },
            rejected: { text: "Rejected Hours" }
        },
        filters: {
            search_placeholder: { text: "Search descriptions..." },
            clear: { text: "Clear" }
        },
        actions: {
            refresh: { text: "Refresh" },
            export_csv: { text: "Export to CSV" },
            add_hour: { text: "Add Hour" },
            try_again: { text: "Try Again" },
            edit: { text: "Edit" },
            approve: { text: "Approve" },
            reject: { text: "Reject" },
        },
        loading: { text: "Loading internship hours..." },
        entries: {
            showing: { text: "Showing" },
            of: { text: "of" },
            entries: { text: "entries" },
            total: { text: "total" },
            filters_applied: { text: "Filters applied" },
            no_entries_found: { text: "No entries found" },
            try_adjusting_filters: { text: "Try adjusting your filters or clearing them." },
            no_hours_yet: { text: "No {{tab}} internship hours yet." },
            hours_entries: { text: "Showing recent hour entries for this student" },
        },
        no_internship: {
            text: "You cannot register hours until you have an approved internship"
        }
    },
    mentor_students: {
        filters:{
            by_status:{
                all: { text: "All Students" },
                active: { text: "Active" },
                pending: { text: "Pending" },
                completed: { text: "Completed" }
            }
        },
        sorting:{
            sort_by_name: { text: "Sort by Name" },
            sort_by_hours: { text: "Sort by Hours" },
            sort_by_university: { text: "Sort by University" },
            sort_by_status: { text: "Sort by Status" }
        },
        actions: {
            view_hours: { text: "View Hours History" },
            approve_hours: { text: "Approve Hours" },
            reject_hours: { text: "Reject Hours" }
        },
        label: {
            no_pending_hours: { text: "All hours approved" }
        },
        export: {
            to_csv: { text: "Export to CSV" }
        }
    },
    document_upload: {
        title: { text: "Document Upload (PDF)" },
        upload_section: {
            title: { text: "Upload Documents (PDF)" },
            select_file: { text: "Select File" },
            no_file: { text: "No file selected" },
            upload_button: { text: "Upload" },
            uploading: { text: "Uploading..." },
            success: { text: "File uploaded successfully!" },
            error: { text: "Error uploading file. Please try again." },
            invalid_file: { text: "Invalid file type. Please upload a PDF." }
        },
        documents_section: {
            title: { text: "Uploaded Documents" },
            no_documents: { text: "No documents uploaded yet." },
        },
        upload_error: {
            error1: {
                text: "Only PDF files are allowed!"
            },
            error2: {
                text: "File size must be less than 10MB!"
            },
            error3: {
                text: "File upload failed. Please try again."
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
                documents: {
                    text: "Documents"
                }
            }
        },
        user_management: {

        },
        document_management: {
            title: {
                text: "Document management"
            },
            table_headers: {
                uploader: {
                    text: "Uploader"
                },
                document_name: {
                    text: "Document Name"
                },
                upload_date: {
                    text: "Upload Date"
                },
                status: {
                    text: "Status"
                },
                actions: {
                    text: "Actions"
                }
            },
             states: {
                pending: {
                    text: "Pending"
                },
                approved: {
                    text: "Approved"
                },
                rejected: {
                    text: "Rejected"
                }
            },
            actions: {
                approve: {
                    text: "Approve"
                },
                reject: {
                    text: "Reject"
                },
                download: {
                    text: "Download"
                }
            }
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
            },
            submit: {
                text: "Submit"
            },
            choose_file: {
                text: "Choose File"
            },
            document_upload: {
                upload_section: {
                    choose_file: { text: 'Choose file' },
                    no_file: { text: 'No file chosen' }
                }
            },
            
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
    },
    days: {
        mon: { text: 'Monday' },
        tue: { text: 'Tuesday' },
        wed: { text: 'Wednesday' },
        thu: { text: 'Thursday' },
        fri: { text: 'Friday' },
        sat: { text: 'Saturday' },
        sun: { text: 'Sunday' },
    },
    time: {
        hour: { text: 'hour' },
        minute: { text: 'minute' },
    }
}