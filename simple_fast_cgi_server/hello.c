#include <fcgi_stdio.h>
#include <stdlib.h>

extern char **environ;
int main () {
    int counter = 0;
    while (FCGI_Accept() >= 0) {
        counter++;
        printf("Status: 200 OK\r\n");
        printf("Content-type: text/html\r\n\r\n");
        printf("<!doctype><html><body>");
        printf("Hello there. Your id is %d<br>", counter);
        for (char **s = environ; *s != NULL; s++)
            printf("%s<br>", *s);
        printf("</body></html>\n");
    }
    return 0;
}
