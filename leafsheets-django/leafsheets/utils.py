"""

--- LeafSheets ---

Utils

Created on Wednesday, Oct 2, 2019
~ satyameva_jayate
"""

# Imports 

from docx import Document

# Utils

def get_all_paragraph_text(doc):
    """Returns an array full of the text from each paragraph with
    the document.
    """
    all_paragraph_text = []
    for p in doc.paragraphs:
        all_paragraph_text.append(p.text)
    return all_paragraph_text


