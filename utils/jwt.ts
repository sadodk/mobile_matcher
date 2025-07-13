export default function decodeJwt(token: string) {
	try {
		const payload = token.split('.')[1];
		const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
		return JSON.parse(decoded);
	} catch {
		return null;
	}
}
