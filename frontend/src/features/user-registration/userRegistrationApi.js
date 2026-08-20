import { apiRequest } from '../../api/apiClient'

export function registerUser(formValues) {
  return apiRequest('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      userName: formValues.userName.trim(),
      password: formValues.password,
      passwordConfirm: formValues.passwordConfirm,
      age: Number(formValues.age),
    }),
  })
}
