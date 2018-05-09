from bs4 import BeautifulSoup
import urllib.request
import sys
import re
import threading

class planetTerpCourse (threading.Thread):
    def __init__(self, clas):
        threading.Thread.__init__(self)
        self.clas = clas

    def run(self):
        global gpa
        global students
        url = 'https://planetterp.com/course/' + self.clas
        try:#reading planet terp avg gpa
            with urllib.request.urlopen(url) as response:
                html = response.read()
                html = html.decode("utf8")
                response.close()
                search = re.search(r'Average GPA: (.*) between (.*) students', html)
                if search:
                    threadLock.acquire()#synchronize update on gpa and students
                    gpa[self.clas] = search.group(1)
                    students[self.clas] = search.group(2)
                    threadLock.release()#release lock
        except:
            print("couldn't find course", self.clas, "on planet terp")


gpa = {}
students = {}
threadLock = threading.Lock()


def main():
    #python3 parse.py -s fall -y 2018 -c DSHS,DVUP num
    #-s : season, eg. fall, spring, summer, winter
    #-y : year, eg. 2018, 2019, etc
    #-c : gen ed categories, eg. DVUP, DSHS, etc. SEPARATED BY comma
    # if any gen ed is okay, enter all for -c
    argc = len(sys.argv)
    if argc < 8:
        print("insufficient arguments...")
        sys.exit()
    else:
        try:
            season = switch(sys.argv[2])
        except:
            print("please enter a correct value for season")
            sys.exit()

        year = sys.argv[4]
        geneds = sys.argv[6].split(",")
        try:
            num = int(sys.argv[7])
        except:
            num = 10

        first_gened = geneds[0]


        url = 'https://app.testudo.umd.edu/soc/gen-ed/' + year + season + '/' + first_gened

        try:
            with urllib.request.urlopen(url) as response:
                html = response.read()
                html = html.decode("utf8")
                response.close()
        except:
            print("Are you sure you entered the year and geneds correctly?\nAre those values valid?")
            sys.exit()

        searchObj = re.search( r'No courses matched your search filters above.', html)
        if searchObj:
            print("No results found.\nAre you sure you entered the correct information?")
            sys.exit()
        else:
            print("parsing html...")
            sys.stdout.flush()

        parsed_html = BeautifulSoup(html, "lxml")
        classes = parsed_html.body.findAll('div', {'class':'course'})

        filtered_classes = filtering(classes, geneds)
        print("threading each filtered class...")
        sys.stdout.flush()
        threads = []

        for x in filtered_classes:#multithreading
            thread = planetTerpCourse(x)
            thread.start()
            threads.append(thread)

        for t in threads:
            t.join()


        sorted_by_gpa = [(k, gpa[k]) for k in sorted(gpa, key=gpa.get, reverse=True)]
        i = 0
        for k,v in sorted_by_gpa:
            if i < num:
                print("For class", k + ",\nAverage GPA:", v, "among", students[k],"students\n")
            i += 1
        #print(result)

def filtering(classes, geneds):
    print("filtering through", len(classes), "classes...")
    sys.stdout.flush()
    list = []

    for clss in classes:
        html = str(clss)
        splitObj = re.search('<span class="course-info-label">(.*)"\s+or\s+"(.*)' , html)

        if splitObj:# if current course gened description contains 'or'
            left = splitObj.group(1)
            right = splitObj.group(2)
            leftCheck = 0;
            rightCheck = 0;
            for gened in geneds:#count how many geneds left side of or satisfies
                search = re.search(gened, left)
                if search:
                    leftCheck += 1

            for gened in geneds:#count how many geneds right side of or satisfies
                search = re.search(gened, right)
                if search:
                    rightCheck += 1

            if leftCheck == len(geneds):
                search = re.search(r'<div class="course-id">(.*)</div>', html)
                list.append(search.group(1))
            elif rightCheck == len(geneds):
                search = re.search(r'<div class="course-id">(.*)</div>', html)
                list.append(search.group(1))
        else:
            check = 0;
            for gened in geneds:
                search = re.search(gened, html)
                if search:
                    check += 1
            if check == len(geneds):#if all gened requirements are met
                search = re.search(r'<div class="course-id">(.*)</div>', html)
                list.append(search.group(1))

    return list

def switch(season):#switch statement for season
    return {
        'fall': '08',
        'summer': '05',
        'spring': '01',
        'winter': '12',
    }[season.lower()]

if __name__ == "__main__":
    main()
