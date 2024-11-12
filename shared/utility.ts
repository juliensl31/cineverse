export const checkValidity = (value: string, rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    hasUpperCase?: boolean;
    hasLowerCase?: boolean;
    hasSpecialChar?: boolean;
}) => {
    let isValid = true;

    // Vérifier si le champ est requis
    if(rules.required) {
        isValid = value.trim() !== '' && isValid;
    }
    // Vérifier si la longueur minimale est respectée
    if(rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
    }
    // Vérifier si la longueur maximale est respectée
    if(rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
    }
    // Vérifier si l'email est valide
    if(rules.email) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid;
    }
    // Vérifier si la valeur contient au moins une lettre majuscule
    if(rules.hasUpperCase) {
        isValid = /[A-Z]/.test(value) && isValid;
    }
    // Vérifier si la valeur contient au moins une lettre minuscule
    if(rules.hasLowerCase) {
        isValid = /[a-z]/.test(value) && isValid;
    }
    // Vérifier si la valeur contient au moins un caractère spécial
    if(rules.hasSpecialChar) {
        isValid = /[!@#$%^&*(),.?":{}|<>]/.test(value) && isValid;
    }

    return isValid;
}