
from typing import Optional, Any, Dict, List, Union
import os
import requests
def shinkai_download_pages(urls: List[Any]) -> Dict[str, Any]:
    """Downloads one or more URLs and converts their HTML content to Markdown

    Args:
        urls: Parameter (required)

    Returns:
        Dict[str, Any]: {
            markdowns: List[str] 
        }
    """
    _url = os.environ.get('SHINKAI_NODE_LOCATION', '') + '/v2/tool_execution'
    data = {
        'tool_router_key': 'local:::shinkai_tool_download_pages:::shinkai__download_pages',
        'tool_type': 'deno',
        'llm_provider': os.environ.get('X_SHINKAI_LLM_PROVIDER', ''),
        'parameters': {
            'urls': urls,
        }
    }
    try:
        response = requests.post(
            _url,
            json=data,
            headers={
                'Authorization': f"Bearer {os.environ.get('BEARER', '')}",
                'x-shinkai-tool-id': os.environ.get('X_SHINKAI_TOOL_ID', ''),
                'x-shinkai-app-id': os.environ.get('X_SHINKAI_APP_ID', ''),
                'x-shinkai-llm-provider': os.environ.get('X_SHINKAI_LLM_PROVIDER', '')
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        error_message = '::NETWORK_ERROR:: '
        if hasattr(e, 'response') and e.response is not None:
            error_message += f"Status: {e.response.status_code}, "
            try:
                error_message += f"Response: {e.response.json()}"
            except:
                error_message += f"Response: {e.response.text}"
        else:
            error_message += str(e)
        raise Exception(error_message)
