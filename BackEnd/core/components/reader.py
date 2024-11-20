
import json

class Reader:
    """
    The purpose of this class is to read the JSON data from the template file
    """
    def __init__(self, template):
        self.template=template

    def reader(self):
        # Read the JSON data from the template
        try:
            with open(self.template, "r") as json_file:
                data = json.load(json_file)
                headers = data["request"]["headers"]
                payloads = data["payloads"]
                method = data["request"]["method"]
                redirects = data['request']["redirects"]

                return headers, payloads,method,redirects
        except FileNotFoundError:
            print("Template file not found")
            return [], [],[],[]



    def readMatchers(self):
        matchtypes = []
        parts = []
        keys = []
        regexs = []
        code=[]
        matchCondition=""
        identity=[]
        info=[]
        severity=[]

        try:
            # Open the JSON file and parse the data
            with open(self.template, "r") as file:
                data = json.load(file)
                matches = data["matches"]
                matchCondition=data["matchers-condition"]
                identity=data["id"]
                info=data["info"]
                severity=data["severity"]

            # Loop through the matches
            for match in matches:
                matchtypes.append(match.get("type", ""))
                parts.append(match.get("part", ""))
                keys.append(match.get("key", ""))
                regexs.append(match.get("regex", ""))
                code.append(match.get("code", ""))

            # return matchers-condition

        except FileNotFoundError as e:
            # Handle FileNotFoundError exceptions here
            print("The specified file does not exist:", e)

        except json.JSONDecodeError as e:
            # Handle JSONDecodeError exceptions here
            print("An error occurred while parsing the JSON data:", e)

        except KeyError as e:
            # Handle KeyError exceptions here
            print("An error occurred while accessing the 'matches' key in the JSON data:", e)

        except Exception as e:
            # Handle any other exceptions here
            print("An unknown error occurred:", e)

        return matchtypes, parts, keys, regexs,code,matchCondition,identity,info,severity


