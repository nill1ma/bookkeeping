import { FieldErrors, UseFormRegister } from "react-hook-form";

export type IncomingFormData = {
    origin: string;
    reference: string;
    value: number;
};

export type ExpenseFormData = {
    destination: string;
    reference: string;
    value: number;
};

export type IncomingFormProps = {
    register: UseFormRegister<IncomingFormData>;
    errors: FieldErrors<IncomingFormData>;
};

export type ExpenseFormProps = {
    register: UseFormRegister<ExpenseFormData>;
    errors: FieldErrors<ExpenseFormData>;
};