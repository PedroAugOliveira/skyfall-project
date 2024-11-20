from requests_html import HTMLSession


session=HTMLSession()



def FindLinksInPage(url): 
    regex=r'.*?:\/\/.*\?.*\=[^$]'
    try:
        response=session.get(url)
        links = response.html.absolute_links
    except:
        links=[]
        return links
    return list(links)


