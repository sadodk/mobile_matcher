const COGNITO_CONFIG = {
	ClientId: '2mig4lgdth8ebo96llg2scil6',
	UserPoolId: 'eu-central-1_0Sn70cSKu',
};

export async function signup({
	email,
	password,
	givenName,
	familyName,
	gender,
	birthdate,
}: {
	email: string;
	password: string;
	givenName: string;
	familyName: string;
	gender?: string;
	birthdate?: string;
}) {
	const userAttributes = [
		{ Name: 'email', Value: email },
		{ Name: 'given_name', Value: givenName },
		{ Name: 'family_name', Value: familyName },
	];
	if (gender) userAttributes.push({ Name: 'gender', Value: gender });
	if (birthdate) userAttributes.push({ Name: 'birthdate', Value: birthdate });

	const params = {
		ClientId: COGNITO_CONFIG.ClientId,
		Username: email,
		Password: password,
		UserAttributes: userAttributes,
	};

	const response = await fetch(
		'https://cognito-idp.eu-central-1.amazonaws.com/',
		{
			method: 'POST',
			headers: {
				'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp',
				'Content-Type': 'application/x-amz-json-1.1',
			},
			body: JSON.stringify(params),
		}
	);

	const data = await response.json();
	if (!response.ok) throw new Error(data.message || 'Signup failed');
	return data;
}

export async function login({
	email,
	password,
}: {
	email: string;
	password: string;
}) {
	const params = {
		AuthFlow: 'USER_PASSWORD_AUTH',
		ClientId: COGNITO_CONFIG.ClientId,
		AuthParameters: {
			USERNAME: email,
			PASSWORD: password,
		},
	};

	const response = await fetch(
		'https://cognito-idp.eu-central-1.amazonaws.com/',
		{
			method: 'POST',
			headers: {
				'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
				'Content-Type': 'application/x-amz-json-1.1',
			},
			body: JSON.stringify(params),
		}
	);

	const data = await response.json();
	if (!response.ok) throw new Error(data.message || 'Login failed');
	return data;
}

export async function testMatchEndpoint({
	idToken,
	userId,
}: {
	idToken: string;
	userId: string;
}) {
	const apiUrl =
		'https://c0su3lk7ae.execute-api.eu-central-1.amazonaws.com/dev/match';
	const response = await fetch(apiUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${idToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			user_id: userId,
			matchCriteria: {
				ageRange: { min: 25, max: 35 },
				gender: 'female',
			},
		}),
	});
	const data = await response.json();
	if (!response.ok) throw new Error(data.message || 'API error');
	return data;
}
