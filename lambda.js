import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(client);

export const handler = async (event) => {
  const intentName = event.sessionState.intent.name;

  if (intentName === "BookAppointment") {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const date = event.sessionState.intent.slots.Date.value.originalValue;
    const time = event.sessionState.intent.slots.Time.value.originalValue;

    // Save appointment to DynamoDB
    const params = {
      TableName: "ACD_KOL_CHATBOT_RECORDS",
      Item: { appointment_id: `${randomNumber}`, date, time },
    };

    await ddbDocClient.put(params);

    return {
      sessionState: {
        dialogAction: {
          type: "Close",
        },
        intent: {
          name: intentName,
          state: "Fulfilled",
        },
      },
      messages: [
        {
          contentType: "PlainText",
          content: `Your appointment is booked for ${date} at ${time}`,
        },
      ],
    };
  }

  return {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        name: "FallbackIntent",
        state: "Failed",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: `Something went wrong`,
      },
    ],
  };
};
