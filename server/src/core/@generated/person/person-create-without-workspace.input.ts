import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import * as Validator from 'class-validator';
import { HideField } from '@nestjs/graphql';
import { CompanyCreateNestedOneWithoutPeopleInput } from '../company/company-create-nested-one-without-people.input';

@InputType()
export class PersonCreateWithoutWorkspaceInput {

    @Field(() => String, {nullable:true})
    @Validator.IsString()
    @Validator.IsOptional()
    id?: string;

    @Field(() => String, {nullable:false})
    @Validator.IsString()
    firstname!: string;

    @Field(() => String, {nullable:false})
    @Validator.IsString()
    lastname!: string;

    @Field(() => String, {nullable:false})
    @Validator.IsEmail()
    email!: string;

    @Field(() => String, {nullable:false})
    @Validator.IsPhoneNumber()
    phone!: string;

    @Field(() => String, {nullable:false})
    @Validator.IsString()
    city!: string;

    @HideField()
    deletedAt?: Date | string;

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => CompanyCreateNestedOneWithoutPeopleInput, {nullable:true})
    company?: CompanyCreateNestedOneWithoutPeopleInput;
}
