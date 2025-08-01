import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InternshipDTO, MentorDTO, MentorProfileDTO, ProfileDTO, ProfileInternshipDTO, StudentDTO, UserRole } from '../../../types';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { InternshipService } from '../../services/internship.service';
import { I18nService } from '../../shared/i18n.pipe';
import { MentorService } from '../../services/mentor.service';
import { StudentService } from '../../services/student.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-student-profile',
  imports: [ReactiveFormsModule, I18nService, CommonModule],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.scss'
})
export class StudentProfileComponent implements OnInit{

  userService = inject(UserService);
  authService = inject(AuthService);
  mentorService = inject(MentorService);
  internshipService = inject(InternshipService);
  studentService = inject(StudentService);
  toastService = inject(ToastService);
  
  fb = inject(FormBuilder);
  profileForm!: FormGroup;
  companyForm!: FormGroup;

  // Loading states
  isLoading = false;
  isProfileLoading = false;
  isInternshipLoading = false;
  isMentorLoading = false;

  // Additional state management
  originalFormValues: any = {};
  hasUnsavedChanges = false;

  profile: ProfileDTO = {
    id: 0,
    email: '',
    firstname: '',
    lastname: '',
    role: UserRole.STUDENT,
    student: undefined
  }

  mentorProfile: MentorProfileDTO = {
    id: 0,
    email: '',
    firstname: '',
    lastname: '',
    role: '',
    active: false,
    mentor: {
      id: 0,
      position: '',
      company: {
        id: 0,
        name: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        active: false,
        mentors: [],
        internships: null
      }
    }
  }

  internship: ProfileInternshipDTO | null = null;

  ngOnInit(): void {
    const currentUserRole = this.authService.getRole();

    this.initializeForms();
    this.loadStudentData();

    if(currentUserRole === "student") {
      this.loadInternshipData();
    } else if(currentUserRole === "mentor") {
      this.loadMentorData();
      this.getMentorStats();
    }
  }

  private initializeForms(): void {
    this.profileForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern(/^\d{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      university: [''],
      major: [''],
      neptun: ['']
    });

    this.companyForm = this.fb.group({
      // Add company form fields if needed
    });
  }
  
  loadStudentData() {
    this.isProfileLoading = true;
    this.userService.getProfile(this.authService.getUserId()).subscribe({
      next: (profileData) => {
        this.profile = profileData;
        this.populateForm();
        this.isProfileLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.toastService.showError('Failed to load profile data');
        this.isProfileLoading = false;
      }
    });
  }

  private populateForm(): void {
    const formValues = {
      email: this.profile.email,
      firstname: this.profile.firstname,
      lastname: this.profile.lastname,
      university: this.profile.student?.university || '',
      phone: this.profile.student?.phone || '',
      major: this.profile.student?.major || '',
      neptun: this.profile.student?.neptun || ''
    };
    
    this.profileForm.patchValue(formValues);
    this.originalFormValues = { ...formValues };
    
    // Watch for form changes
    this.profileForm.valueChanges.subscribe(() => {
      this.hasUnsavedChanges = !this.isFormEqualToOriginal();
    });
  }

  private isFormEqualToOriginal(): boolean {
    const currentValues = this.profileForm.value;
    return JSON.stringify(currentValues) === JSON.stringify(this.originalFormValues);
  }

  loadInternshipData() {
    this.isInternshipLoading = true;
    this.internshipService.getByStudentId(this.authService.getUserId()).subscribe({
      next: (internshipData) => {
        this.internship = internshipData;
        this.isInternshipLoading = false;
      },
      error: (err) => {
        console.error('Error loading internship:', err);
        // Don't show error toast for missing internship - it's normal
        this.isInternshipLoading = false;
      }
    });
  }

  loadMentorData() {
    this.isMentorLoading = true;
    this.mentorService.getByUserId(this.authService.getUserId()).subscribe({
      next: (mentorData) => {
        this.mentorProfile = mentorData;
        this.populateMentorForm();
        this.isMentorLoading = false;
      },
      error: (err) => {
        console.error('Error loading mentor data:', err);
        this.toastService.showError('Failed to load mentor data');
        this.isMentorLoading = false;
      }
    });
  }

  private populateMentorForm(): void {
    if (this.mentorProfile) {
      this.profileForm.patchValue({
        firstname: this.mentorProfile.firstname,
        lastname: this.mentorProfile.lastname,
        email: this.mentorProfile.email,
        university: this.mentorProfile.mentor.company.name, // Company name instead of university
        major: this.mentorProfile.mentor.position, // Position instead of major
        phone: '', // Mentors might not have phone in this structure
        neptun: '' // Mentors don't have neptun
      });
    }
  }

  onSubmitProfile() {
    // Only check required fields (firstname, lastname, email)
    const requiredFields = ['firstname', 'lastname', 'email'];
    const hasRequiredFieldErrors = requiredFields.some(field => {
      const control = this.profileForm.get(field);
      return control && control.invalid;
    });

    if (hasRequiredFieldErrors) {
      this.markFormGroupTouched(this.profileForm);
      this.toastService.showError('Please fill all required fields correctly (Name, Lastname, Email)');
      return;
    }

    this.isLoading = true;
    const formValue = this.profileForm.value;

    // Create the complete user data structure as expected by the backend
    const userData = {
      id: this.profile.id,
      email: formValue.email,
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      role: this.profile.role,
      active: true,
      student: {
        id: this.profile.student?.id || 0,
        phone: formValue.phone && formValue.phone.trim() ? formValue.phone.trim() : null,
        neptun: formValue.neptun && formValue.neptun.trim() ? formValue.neptun.trim() : null,
        major: formValue.major && formValue.major.trim() ? formValue.major.trim() : null,
        university: formValue.university && formValue.university.trim() ? formValue.university.trim() : null
      }
    };

    console.log('Sending user data:', userData); // Debug log

    this.userService.updateUser(this.authService.getUserId(), userData).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Profile updated successfully!');
        this.loadStudentData(); // Reload data to reflect changes
        this.hasUnsavedChanges = false;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.toastService.showError('Failed to update profile');
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  resetProfile() {
    this.profileForm.reset();
    this.populateForm(); // Reload original data
    this.hasUnsavedChanges = false;
    this.toastService.showSuccess('Form reset to original values');
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Invalid email format';
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['pattern']) {
        if (fieldName === 'neptun') return 'Neptun code must be 6 characters (letters/numbers)';
        if (fieldName === 'phone') return 'Invalid phone number format';
      }
    }
    return '';
  }

  onSubmitCompanyForm() {
    // Implement company form submission if needed
    console.log('Company form submission not implemented yet');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.toastService.showError('Please select a valid image file (JPEG, PNG, or GIF)');
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.toastService.showError('File size must be less than 5MB');
        return;
      }
      
      // Here you would typically upload the file to your server
      console.log('File selected:', file.name);
      this.toastService.showSuccess('File selected successfully! Upload functionality to be implemented.');
      
      // For now, just show a preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // You could update the avatar image src here
        console.log('File loaded:', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // Utility method to get current user info
  getCurrentUserInfo() {
    return {
      id: this.authService.getUserId(),
      name: this.authService.getUserName(),
      role: this.authService.getRole()
    };
  }

  // Mentor specific functionality
  getMentorStats() {
    if (this.authService.getRole() === 'mentor') {
      // Get mentor's students and statistics
      this.mentorService.getStudents().subscribe({
        next: (students) => {
          console.log('Mentor students:', students);
          // This could be stored in a property to display
        },
        error: (err) => {
          console.error('Error loading mentor students:', err);
        }
      });
    }
  }

  // Copy company info to clipboard
  copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.toastService.showSuccess(`${label} copied to clipboard!`);
    }).catch(() => {
      this.toastService.showError('Failed to copy to clipboard');
    });
  }

  // Contact company directly
  contactCompany() {
    if (this.mentorProfile.mentor?.company) {
      const email = this.mentorProfile.mentor.company.email;
      const subject = `Contact from ${this.mentorProfile.firstname} ${this.mentorProfile.lastname}`;
      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
    }
  }

  // Get company location for maps
  openLocationInMaps() {
    if (this.mentorProfile.mentor?.company) {
      const address = `${this.mentorProfile.mentor.company.address}, ${this.mentorProfile.mentor.company.city}`;
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
    }
  }
}
