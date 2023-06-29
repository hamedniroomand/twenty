import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';

@InputType()
export class CommentThreadTargetMinAggregateInput {

    @Field(() => Boolean, {nullable:true})
    id?: true;

    @Field(() => Boolean, {nullable:true})
    commentThreadId?: true;

    @Field(() => Boolean, {nullable:true})
    commentableType?: true;

    @Field(() => Boolean, {nullable:true})
    commentableId?: true;

    @HideField()
    deletedAt?: true;

    @Field(() => Boolean, {nullable:true})
    createdAt?: true;

    @Field(() => Boolean, {nullable:true})
    updatedAt?: true;
}
