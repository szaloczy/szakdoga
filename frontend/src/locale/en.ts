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
    common: {
        yes: { text: 'Yes' },
        no: { text: 'No' }
    },
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
            text: "*Terms must be accepted"
        },
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
            progress_statistics: { text: "Progress Statistics" },
            completed_hours: { text: "Completed hours" },
            completed_weeks: { text: "Completed weeks" },
            remaining_hours: { text: "Remaining hours" },
            remaining_weeks: { text: "Remaining weeks" },
            progress_status: { text: "Progress Status" },
            completed_vs_required_hours: { text: "Completed / Required Hours" },
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
        },
        messages: {
            delete_hour: {
                success: {
                    text: "Hour deleted successfully" 
                },
                failed: {
                    text: "Deletion failed"
                }
            },
            update_hour: {
                success: {
                    text: "Hour updated successfully"
                },
                failed: {
                    text: "Update failed"
                }
            }
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
            },
            descriptions: {
                user_desc: {
                    text: "Manage registered users"
                },
                companies_desc: {
                    text: "Manage companies"
                },
                internship_desc: {
                    text: "Manage internships"
                },
                document_desc: {
                    text: "Manage uploaded documents"
                }
            }
        },
        user_management: {
            title: {
                text: "User management"
            },
            buttons: {
                add_student: { text: "Add Student" },
                add_mentor: { text: "Add Mentor" },
                back_to_dashboard: { text: "Back to Dashboard" }
            },
            table_headers: {
                name: { text: "Name" },
                email: { text: "Email" },
                role: { text: "Role" },
                status: { text: "Status" },
                actions: { text: "Actions" }
            },
            add_student_form: {
                title: { text: "Add New Student" },
                firstname: { text: "First Name" },
                lastname: { text: "Last Name" },
                email: { text: "Email" },
                active: { text: "Active" },
                password: { text: "Password" }
            },
            add_mentor_form: {
                title: { text: "Add New Mentor" },
                firstname: { text: "First Name" },
                lastname: { text: "Last Name" },
                password: { text: "Password" },
                position: { text: "Position" },
                email: { text: "Email" },
                company: { text: "Company" },
                active: { text: "Active" },
                inactive: { text: "Inactive" }
            },
            edit_student_form: {
                title: { text: "Edit Student" },
                firstname: { text: "First Name" },
                lastname: { text: "Last Name" },
                email: { text: "Email" },
                active: { text: "Active" },
                password: { text: "Password" }
            }
        },
        company_management: {
            title: {
                text: "Company management"
            },
            buttons: {
                add_company: { text: "Add Company" },
                back_to_dashboard: { text: "Back to Dashboard" }
            },
            table_headers: {
                name: { text: "Company Name" },
                city: { text: "City" },
                address: { text: "Address" },
                active: { text: "Active" },
                actions: { text: "Actions" }
            },
            form: {
                title: { text: "Add New Company" },
                name: { text: "Company Name" },
                city: { text: "City" },
                address: { text: "Address" },
                active: { text: "Active" }
            }
        },
        internship_management: {
            title: {
                text: "Internship management"
            },
            buttons: {
                add_internship: { text: "Add Internship" },
                back_to_dashboard: { text: "Back to Dashboard" }
            },
            table_headers: {
                student: { text: "Student" },
                mentor: { text: "Mentor" },
                company: { text: "Company" },
                start_date: { text: "Start Date" },
                is_approved: { text: "Approval Status" },
                actions: { text: "Actions" }
            },
            form: {
                title: { text: "Add New Internship" },
                student: { text: "Select Student" },
                mentor: { text: "Select Mentor" },
                company: { text: "Select Company" },
                start_date: { text: "Start Date" },
                end_date: { text: "End Date" },
                is_approved: { text: "Approval Status" },
                options: {
                    approved: { text: "Approved" },
                    not_approved: { text: "Not Approved" }
                }
            }
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
            edit: {
                text: "Edit"
            },
            delete: {
                text: "Delete"
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
    statistics: {
        title: { text: "Statistics" },
        charts: {
            pie: { text: "Hours by Status" },
            candle: { text: "Hours by Month" },
            line: { text: "Cumulative Hours" }
        },
        candle: {
            hours_per_month: { text: "Internship hours per month" }
        },
        pie: {
            hour_status: { text: "Internship hours by status" }
        }
        ,
        loading: { text: "Loading statistics..." },
        no_data: { text: "No data available for statistics." }
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
    },
    be_response: {
        common: {
            student_not_found: { text: "Student not found." },
            hour_entry_not_found: { text: "Hour entry not found." },
            mentor_not_found: { text: "Mentor not found." }
        },
        create_hour: {
            no_approved_internship: { text: "This student doesn't have an approved internship." },
            future_date_not_allowed: { text: "Cannot create internship hour for a future date." },
            start_time_must_be_earlier: { text: "Start time must be earlier than end time." },
            date_out_of_internship_period: { text: "Internship hour date must be within the internship period." },
            only_8_hours_per_day_allowed: { text: "You can record up to 8 hours per day." }
        },
        update_hour: {
            only_own_entry_update: { text: "You can only update your own hour entries." },
            only_pending_update: { text: "Can only update pending hour entries." }
        },
        delete_hour: {
            only_own_entry_delete: { text: "You can only delete your own hour entries." },
            only_pending_delete: { text: "Can only delete pending hour entries." }
        },
        approve_hour: {
            only_own_students: { text: "You can only approve hours for your own students." },
            only_pending_approve: { text: "Can only approve pending hour entries." }
        },
        reject_hour: {
            only_own_students: { text: "You can only reject hours for your own students." },
            only_pending_reject: { text: "Can only reject pending hour entries." }
        },
        bulk_approve: {
            no_hours_found_by_ids: { text: "No hours found with the provided IDs." },
            only_own_students: { text: "You can only approve hours for your own students." },
            no_pending_hours: { text: "No pending hours found to approve." }
        },
        approve_all: {
            no_approved_internship_for_student: { text: "No approved internship found for this student under your mentorship." },
            no_pending_hours_for_student: { text: "No pending hours found for this student." }
        },
        reject_all: {
            no_approved_internship_for_student: { text: "No approved internship found for this student under your mentorship." },
            no_pending_hours_for_student: { text: "No pending hours found for this student." }
        }
    }
}