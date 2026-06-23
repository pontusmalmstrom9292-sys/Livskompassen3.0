import json

def get_assistant_responses(file_path):
    responses = []
    with open(file_path, 'r') as f:
        for line in f:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE' and data.get('source') == 'MODEL':
                responses.append(data.get('content'))
    return responses[-1] if responses else None

print("--- fas3 pr 5 ---")
r1 = get_assistant_responses('/Users/Livskompassen/.gemini/antigravity/brain/79c3d0a1-e3f4-41b1-9c52-e719c0329718/.system_generated/logs/transcript.jsonl')
print(r1)
print("\n--- fas 3 pr6 ---")
r2 = get_assistant_responses('/Users/Livskompassen/.gemini/antigravity/brain/49225171-d1d2-469e-953c-2ed674e48194/.system_generated/logs/transcript.jsonl')
print(r2)
