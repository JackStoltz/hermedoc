import subprocess

subprocess.check_call(['pip','install','llama-index'])
subprocess.check_call(['pip','install','llama-index-embeddings-huggingface'])
subprocess.check_call(['pip','install','llama-index-llms-ollama'])
subprocess.check_call(['ollama', 'pull', 'llama3'])
subprocess.check_call(['pip', 'install', 'dill'])