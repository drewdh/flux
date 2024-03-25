const apiUrl = 'https://api.drewhanberry.com/feedback/create';

interface SendFeedbackRequest {
  email: string;
  message: string;
  type: string;
  satisfied: string;
}

type SendFeedbackResponse = unknown;

export async function sendFeedback(request: SendFeedbackRequest): Promise<SendFeedbackResponse> {
  const resp = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return resp.json();
}
