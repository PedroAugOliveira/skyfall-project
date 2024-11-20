import re 
import json
from requests_html import HTMLSession
from lxml_html_clean import Cleaner




class Extractor:

    def param_extract(self, response, level, black_list, placeholder):

        ''' 
        Function to extract URLs with parameters (ignoring the black list extention)
        regexp : r'.*?:\/\/.*\?.*\=[^$]'
        
        '''

        parsed = list(set(re.findall(r'.*?:\/\/.*\?.*\=[^$]' , response)))
        final_uris = []
        if placeholder == None:
            placeholder = ""
        for i in parsed:
            delim = i.find('=')
            second_delim = i.find('=', i.find('=') + 1)
            if len(black_list) > 0:
                words_re = re.compile("|".join(black_list))
                if not words_re.search(i):
                    final_uris.append((i[:delim+1] + placeholder)) 
                    if level == 'high':
                        final_uris.append(i[:second_delim+1] + placeholder)
            else:
                final_uris.append((i[:delim+1] + placeholder))
                if level == 'high':
                    final_uris.append(i[:second_delim+1] + placeholder)

        
        
        return list(set(final_uris))



    # a method to find list1 strings in list2
    def find_strings(self, list1, list2):
        final_list = []
        for i in list1:
            for j in list2:
                if j in i:
                    final_list.append(i)
        return final_list

