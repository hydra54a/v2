const FormService = require('../services/FormService');
const FormRepository = require('../repositories/FormRepository');

jest.mock('../repositories/FormRepository');

describe('FormService', () => {
  const mockForm = {
    id: 1,
    user_id: 42,
    organization_id: 10,
    form_type: 'survey',
    categories: 'feedback',
    association: 'internal',
    title: 'Customer Feedback',
    description: 'Provide your feedback',
    copyright_protected: false,
    fields: [
      {
        id: 1,
        type: 'text',
        label: 'Name',
        placeholder: 'Enter your name',
        required: true,
        options: null,
        position: 1,
      },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new form', async () => {
    FormRepository.createForm.mockResolvedValue(mockForm);

    const formData = {
      user_id: 42,
      organization_id: 10,
      form_type: 'survey',
      categories: 'feedback',
      association: 'internal',
      title: 'Customer Feedback',
      description: 'Provide your feedback',
      copyright_protected: false,
      fields: [
        {
          type: 'text',
          label: 'Name',
          placeholder: 'Enter your name',
          required: true,
          position: 1,
        },
      ],
    };

    const result = await FormService.createForm(formData);

    expect(FormRepository.createForm).toHaveBeenCalledWith(formData);
    expect(result).toEqual(mockForm);
  });

  test('should fetch a form by ID', async () => {
    FormRepository.getFormById.mockResolvedValue(mockForm);

    const result = await FormService.getFormById(1);

    expect(FormRepository.getFormById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockForm);
  });

  test('should fetch all forms', async () => {
    FormRepository.getAllForms.mockResolvedValue([mockForm]);

    const result = await FormService.getAllForms();

    expect(FormRepository.getAllForms).toHaveBeenCalled();
    expect(result).toEqual([mockForm]);
  });

  test('should fetch forms by user ID', async () => {
    FormRepository.getFormsByUser.mockResolvedValue([mockForm]);

    const result = await FormService.getFormsByUser(42);

    expect(FormRepository.getFormsByUser).toHaveBeenCalledWith(42);
    expect(result).toEqual([mockForm]);
  });

  test('should fetch forms by organization ID', async () => {
    FormRepository.getFormsByOrganization.mockResolvedValue([mockForm]);

    const result = await FormService.getFormsByOrganization(10);

    expect(FormRepository.getFormsByOrganization).toHaveBeenCalledWith(10);
    expect(result).toEqual([mockForm]);
  });

  test('should delete a form by ID', async () => {
    FormRepository.deleteForm.mockResolvedValue(true);

    const result = await FormService.deleteForm(1);

    expect(FormRepository.deleteForm).toHaveBeenCalledWith(1);
    expect(result).toBe(true);
  });

  test('should edit a form by ID', async () => {
    const updatedForm = { ...mockForm, title: 'Updated Title' };
    FormRepository.editForm.mockResolvedValue(updatedForm);

    const result = await FormService.editForm(1, updatedForm);

    expect(FormRepository.editForm).toHaveBeenCalledWith(1, updatedForm);
    expect(result).toEqual(updatedForm);
  });
});
