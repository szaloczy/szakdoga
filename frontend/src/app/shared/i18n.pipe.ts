import { Injectable, Pipe, PipeTransform } from "@angular/core";
import { I18nItem, Language, NestedI18n, Translations } from "../../types";
import { en } from "../../locale/en";
import { hu } from "../../locale/hu";

@Injectable ({
    providedIn: 'root'
})
@Pipe({
    name: 'translate',
    standalone: true
})
export class I18nService implements PipeTransform {
    private readonly langs!: Translations;
    private currentLanguage: Language = Language.EN;

    constructor() {
        this.langs = {
            en: en,
            hu: hu
        };
        this.currentLanguage = this.getLanguage();
    }

    transform(value: string, resolveObj?: Record<string, string>) {
        const keys = value.split('.');
        let resource: I18nItem | undefined;
        let nestedObj = this.langs[this.currentLanguage];
        let rnf = false;

        keys.forEach((key) => {
            if (rnf) return;
            if(!nestedObj[key]) {
                rnf = true;
                return;
            }

            if(nestedObj[key].text) {
                resource = (nestedObj as Record<string, I18nItem>)[key];
            } else {
                nestedObj = (nestedObj as Record<string, NestedI18n>)[key];
            }
        });

        if(resource) {
            if(resolveObj) {
                return this.resolveTemplate(resource.text, resolveObj);
            } else {
                return resource.text;
            }
        } else {
            console.warn(`Translation for ${value} not found`);
            return `!RNF: ${value}`;
        }
    }

    switchLanguage(newLang: string) {
        this.currentLanguage = newLang as Language;
        localStorage.setItem('currentLang', newLang);
        window.location.reload();
    }

    getLanguage(): Language {
        const lang = localStorage.getItem('currentLang');
        return lang as Language || Language.EN;
    }

    private resolveTemplate(template: string, variables: Record<string, string>): string {
    return template.replace(/\$\{(\w+)\}/g, (_, key) => variables[key] || '');
    }
}