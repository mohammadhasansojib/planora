export interface UserRegistrationPayload {
	username: string;
	email: string;
	password: string;
}

export interface UserLoginPayload {
	email: string;
	password: string;
}
