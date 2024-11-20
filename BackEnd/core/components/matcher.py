import re


class Matchers:

    def __init__(self,matchCondition=None,matchtype=None,part=None,key=None,regex=None,code=None,payloads=None,rbody=None,responseData=None,url=None,identity=None,info=None,severity=None):
        self.matchCondition=matchCondition
        self.matchtype=matchtype
        self.part=part
        self.key=key
        self.regex=regex
        self.code=code
        self.payloads=payloads
        self.rbody=rbody
        self.responseData=responseData
        self.url=url
        self.identity=identity
        self.info=info
        self.severity=severity



    def regex_match(self,pattern: str, string: str) -> bool:
        """Check if a string matches a regular expression pattern.
        
        Arguments:
            pattern: A string containing a regular expression pattern.
            string: The string to match against the pattern.
        
        Returns:
            True if the string matches the pattern, False otherwise.
        """
        try:
            # Compile the regular expression pattern
            regex = re.compile(pattern, re.MULTILINE | re.IGNORECASE)
            
            # Use the finditer() method to find matches in the string
            matches = regex.finditer(string)
            
            # If the iterator contains any matches, return True
            return any(matches)
        except Exception as e:
            # If an error occurred, print the error message and return False
            print(e)
            return False


    def isStatus(self):
        for match in self.matchtype:
            if match == 'status':
                return True
            


    def isRegex(self):
        for match in self.matchtype:
            if match == 'regex':
                return True



    def isBody(self):
        for match in self.part:
            if match == 'body':
                return True


    def isHeader(self):
        for match in self.part:
            if match == 'header':
                return True



    def statusCodeMatch(self):
        try:
            if self.isStatus():
                for payload in self.payloads:
                    for key in self.responseData[payload]:
                        if key == 'status':
                            for code in self.code:
                                for c in code:
                                    if self.responseData[payload][key] == c:
                                        return True
        except KeyError:
            pass
        return False



    def headerMatch(self):
        try:
            if self.isHeader():
                for payload in self.payloads:
                    for key in self.responseData[payload]:
                        if key == 'headers':
                            for k in self.key:
                                if k in self.responseData[payload][key]:
                                    for r in self.regex:
                                        if r:  # Ensure that the regex is not empty
                                            string = f'{k}:{self.responseData[payload][key][k]}'
                                            if self.regex_match(r, string):
                                                return True
        except KeyError:
            pass
        return False



    def bodyMatch(self):
        try:
            if self.isBody():
                for payload in self.payloads:
                    for key in self.responseData[payload]:
                        if key == 'data':
                            for r in self.regex:
                                if self.regex_match(r, str(self.responseData[payload][key])):
                                    return True
        except KeyError:
            pass
        return False



    def isVulnerablity(self):
        conditions = []

        if self.isStatus():
            conditions.append(self.statusCodeMatch())
        if self.isHeader():
            conditions.append(self.headerMatch())
        if self.isBody():
            conditions.append(self.bodyMatch())
        if self.matchCondition == "and":
            if all(conditions):
                return True
        elif self.matchCondition == "or":
            if any(conditions):
                return True

        return False


        
    
    def forAPI(self):
        vulnerability = self.isVulnerablity()

        result = {
            "identity": self.identity,
            "url": self.url,
            "vulnerability": vulnerability,
        }

        if vulnerability:
            result["severity"] = self.severity
            result["info"] = self.info

        if self.isStatus():
            result["status_code_match"] = self.statusCodeMatch()
        if self.isHeader():
            result["header_match"] = self.headerMatch()
        if self.isBody():
            result["body_match"] = self.bodyMatch()

        # Remove empty or unused fields from the result dictionary
        result = {k: v for k, v in result.items() if v not in [None, "", []]}

        return result

