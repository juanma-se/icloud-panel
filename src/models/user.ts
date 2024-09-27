export interface User {
	id: number,
	name: string,
	email: string,
	email_verified_at?: string,
    privilege: Privilege[]
}

export interface Privilege {
	role: string
	permissions: string[]
}