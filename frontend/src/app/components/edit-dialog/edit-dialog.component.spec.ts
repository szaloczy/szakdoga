import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDialogComponent } from './edit-dialog.component';
import { DialogField } from '../../../types';

describe('EditDialogComponent', () => {
  let component: EditDialogComponent;
  let fixture: ComponentFixture<EditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default properties correctly', () => {
    expect(component.title).toBe('Enter information');
    expect(component.message).toBe('Please enter the required information:');
    expect(component.fields).toEqual([]);
    expect(component.formData).toEqual({});
    expect(component.defaultValue).toBe('');
    expect(component.placeholder).toBe('');
    expect(component.confirmButtonText).toBe('OK');
    expect(component.cancelButtonText).toBe('Cancel');
    expect(component.showDialog).toBeFalse();
  });

  it('should focus input when dialog is shown', (done) => {
    const mockInput = jasmine.createSpyObj('HTMLInputElement', ['focus', 'select']);
    spyOn(document, 'querySelector').and.returnValue(mockInput);
    
    component.showDialog = true;
    component.defaultValue = 'test value';
    
    component.ngOnChanges();
    
    setTimeout(() => {
      expect(component.inputValue).toBe('test value');
      expect(document.querySelector).toHaveBeenCalledWith('input[type="text"]');
      expect(mockInput.focus).toHaveBeenCalled();
      expect(mockInput.select).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should not focus input when dialog is not shown', () => {
    spyOn(document, 'querySelector');
    
    component.showDialog = false;
    
    component.ngOnChanges();
    
    expect(document.querySelector).not.toHaveBeenCalled();
  });

  it('should handle null input element gracefully', (done) => {
    spyOn(document, 'querySelector').and.returnValue(null);
    
    component.showDialog = true;
    component.defaultValue = 'test value';
    
    component.ngOnChanges();
    
    setTimeout(() => {
      expect(component.inputValue).toBe('test value');
      expect(document.querySelector).toHaveBeenCalledWith('input[type="text"]');
      // Should not throw an error
      done();
    }, 0);
  });

  it('should emit confirmed event with form data on confirm', () => {
    spyOn(component.confirmed, 'emit');
    spyOn(component, 'closeDialog');
    
    component.formData = { name: 'test', value: 'data' };
    
    component.onConfirm();
    
    expect(component.confirmed.emit).toHaveBeenCalledWith({ name: 'test', value: 'data' });
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should convert string boolean values to actual booleans for active field', () => {
    spyOn(component.confirmed, 'emit');
    spyOn(component, 'closeDialog');
    
    const activeField: DialogField = {
      name: 'active',
      type: 'select',
      label: 'Active',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' }
      ]
    };
    
    component.fields = [activeField];
    component.formData = { active: 'true' };
    
    component.onConfirm();
    
    expect(component.formData['active']).toBe(true);
    expect(component.confirmed.emit).toHaveBeenCalledWith({ active: true });
  });

  it('should convert string "false" to boolean false for active field', () => {
    spyOn(component.confirmed, 'emit');
    spyOn(component, 'closeDialog');
    
    const activeField: DialogField = {
      name: 'active',
      type: 'select',
      label: 'Active',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' }
      ]
    };
    
    component.fields = [activeField];
    component.formData = { active: 'false' };
    
    component.onConfirm();
    
    expect(component.formData['active']).toBe(false);
    expect(component.confirmed.emit).toHaveBeenCalledWith({ active: false });
  });

  it('should convert string boolean values to actual booleans for isApproved field', () => {
    spyOn(component.confirmed, 'emit');
    spyOn(component, 'closeDialog');
    
    const approvedField: DialogField = {
      name: 'isApproved',
      type: 'select',
      label: 'Approved',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' }
      ]
    };
    
    component.fields = [approvedField];
    component.formData = { isApproved: 'false' };
    
    component.onConfirm();
    
    expect(component.formData['isApproved']).toBe(false);
    expect(component.confirmed.emit).toHaveBeenCalledWith({ isApproved: false });
  });

  it('should not convert non-boolean string values', () => {
    spyOn(component.confirmed, 'emit');
    spyOn(component, 'closeDialog');
    
    const activeField: DialogField = {
      name: 'active',
      type: 'select',
      label: 'Active',
      options: [
        { value: 'maybe', label: 'Maybe' }
      ]
    };
    
    component.fields = [activeField];
    component.formData = { active: 'maybe' };
    
    component.onConfirm();
    
    expect(component.formData['active']).toBe('maybe');
    expect(component.confirmed.emit).toHaveBeenCalledWith({ active: 'maybe' });
  });

  it('should not convert values for non-select fields', () => {
    spyOn(component.confirmed, 'emit');
    spyOn(component, 'closeDialog');
    
    const textField: DialogField = {
      name: 'name',
      type: 'text',
      label: 'Name'
    };
    
    component.fields = [textField];
    component.formData = { name: 'true' };
    
    component.onConfirm();
    
    expect(component.formData['name']).toBe('true');
    expect(component.confirmed.emit).toHaveBeenCalledWith({ name: 'true' });
  });

  it('should not convert values for fields with different names', () => {
    spyOn(component.confirmed, 'emit');
    spyOn(component, 'closeDialog');
    
    const otherField: DialogField = {
      name: 'other',
      type: 'select',
      label: 'Other',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' }
      ]
    };
    
    component.fields = [otherField];
    component.formData = { other: 'true' };
    
    component.onConfirm();
    
    expect(component.formData['other']).toBe('true');
    expect(component.confirmed.emit).toHaveBeenCalledWith({ other: 'true' });
  });

  it('should emit canceled event on cancel', () => {
    spyOn(component.canceled, 'emit');
    spyOn(component, 'closeDialog');
    
    component.onCancel();
    
    expect(component.canceled.emit).toHaveBeenCalled();
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should close dialog and emit showDialogChange event', () => {
    spyOn(component.showDialogChange, 'emit');
    
    component.showDialog = true;
    component.closeDialog();
    
    expect(component.showDialog).toBeFalse();
    expect(component.showDialogChange.emit).toHaveBeenCalledWith(false);
  });

  it('should handle different field types', () => {
    const textField: DialogField = {
      name: 'name',
      type: 'text',
      label: 'Name'
    };
    
    const selectField: DialogField = {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    };
    
    component.fields = [textField, selectField];
    component.formData = { name: 'Test Name', status: 'active' };
    
    expect(component.fields.length).toBe(2);
    expect(component.fields[0].type).toBe('text');
    expect(component.fields[1].type).toBe('select');
  });

  it('should handle multiple fields in onConfirm', () => {
    spyOn(component.confirmed, 'emit');
    spyOn(component, 'closeDialog');
    
    const fields: DialogField[] = [
      {
        name: 'active',
        type: 'select',
        label: 'Active',
        options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }]
      },
      {
        name: 'isApproved',
        type: 'select',
        label: 'Approved',
        options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }]
      },
      {
        name: 'name',
        type: 'text',
        label: 'Name'
      }
    ];
    
    component.fields = fields;
    component.formData = { active: 'true', isApproved: 'false', name: 'Test' };
    
    component.onConfirm();
    
    expect(component.formData['active']).toBe(true);
    expect(component.formData['isApproved']).toBe(false);
    expect(component.formData['name']).toBe('Test');
    expect(component.confirmed.emit).toHaveBeenCalledWith({ 
      active: true, 
      isApproved: false, 
      name: 'Test' 
    });
  });
});
