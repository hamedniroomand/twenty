import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { StringFieldUpdateOperationsInput } from '../prisma/string-field-update-operations.input';
import { EnumPipelineProgressableTypeFieldUpdateOperationsInput } from '../prisma/enum-pipeline-progressable-type-field-update-operations.input';
import { HideField } from '@nestjs/graphql';
import { NullableDateTimeFieldUpdateOperationsInput } from '../prisma/nullable-date-time-field-update-operations.input';
import { DateTimeFieldUpdateOperationsInput } from '../prisma/date-time-field-update-operations.input';
import { PipelineStageUncheckedUpdateManyWithoutPipelineNestedInput } from '../pipeline-stage/pipeline-stage-unchecked-update-many-without-pipeline-nested.input';

@InputType()
export class PipelineUncheckedUpdateWithoutPipelineProgressesInput {

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    id?: StringFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    name?: StringFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {nullable:true})
    icon?: StringFieldUpdateOperationsInput;

    @Field(() => EnumPipelineProgressableTypeFieldUpdateOperationsInput, {nullable:true})
    pipelineProgressableType?: EnumPipelineProgressableTypeFieldUpdateOperationsInput;

    @HideField()
    workspaceId?: StringFieldUpdateOperationsInput;

    @HideField()
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput;

    @Field(() => DateTimeFieldUpdateOperationsInput, {nullable:true})
    createdAt?: DateTimeFieldUpdateOperationsInput;

    @Field(() => DateTimeFieldUpdateOperationsInput, {nullable:true})
    updatedAt?: DateTimeFieldUpdateOperationsInput;

    @Field(() => PipelineStageUncheckedUpdateManyWithoutPipelineNestedInput, {nullable:true})
    pipelineStages?: PipelineStageUncheckedUpdateManyWithoutPipelineNestedInput;
}
