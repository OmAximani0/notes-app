export function checkFields(
    body: object,
    requiredFields: string[],
    response: CustomResponse
) {
    for (let i = 0; i < requiredFields.length; i++) {
        if (requiredFields[i] in body) {
            continue;
        } else {
            if (!response["error"]) {
                response["error"] = [`${requiredFields[i]} is required!`];
            } else {
                response["error"].push(`${requiredFields[i]} is required!`);
            }
        }
    }
}
