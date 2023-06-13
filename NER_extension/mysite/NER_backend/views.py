import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User #####
from django.views.decorators.csrf import csrf_exempt
import spacy
import re

nlp = spacy.load("en_core_web_sm")

# Create your views here.
def index(request):
    return HttpResponse("Hello, world. You're at the index.")


# @csrf_exempt  # Apply the csrf_exempt decorator to disable CSRF protection for this view
# def get_NER(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)  # Parse the request body as JSON
#             sentence = data.get('sentence', None)  # Retrieve the sentence from the JSON data
#             sentence = sentence.get('result', None)
            
#             #clean the sentence
#             sentence = re.sub(r'\[.*?\]', '', sentence)
#             # sentence = re.sub(r'\d','',sentence)
#             # sentence = sentence.lower()

#             with open('sentence.txt', 'w') as f:
#                 f.write(sentence)
#             if sentence:
#                 doc = nlp(sentence)
#                 result = {'entities': []}

#                 for ent in doc.ents:

#                     result['entities'].append({'entity': ent.label_, 'value': ent.text})
#                 result['length'] = len(result['entities'])
#                 return JsonResponse(result, safe=False)
#             else:
#                 return JsonResponse({'error': 'Invalid request'}, status=400)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON data'}, status=400)
#     else:
#         return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def get_NER(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Parse the request body as JSON
            sentence = data.get('sentence', None)  # Retrieve the sentence from the JSON data
            sentence = sentence.get('result', None)

            # Clean the sentence
            sentence = re.sub(r'\[.*?\]', '', sentence)

            if sentence:
                doc = nlp(sentence)
                unique_entities = set()
                result = {'entities': []}

                for ent in doc.ents:
                    # Check if the entity has already been encountered
                    if ent.text not in unique_entities:
                        unique_entities.add(ent.text)
                        result['entities'].append({'entity': ent.label_, 'value': ent.text})

                result['length'] = len(result['entities'])
                return JsonResponse(result, safe=False)
            else:
                return JsonResponse({'error': 'Invalid request'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

