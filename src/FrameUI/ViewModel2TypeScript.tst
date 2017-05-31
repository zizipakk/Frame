${
    Template(Settings settings) {
        settings.IncludeProject("FrameAuth");
        settings.IncludeProject("FrameIO");
        settings.IncludeProject("FrameLog");
        settings.OutputFilenameFactory = file =>
        {
            return $".\\src\\app\\models\\{file.Name.Replace(".cs", ".ts")}"; //2.0 will be great for foreign project output
        };
    }

    string InterfaceNameWithExtends(Class c) {
        return "I" + c.name +  (c.BaseClass != null ?  " extends I" + c.BaseClass.name : "");
    }

    string ClassNameWithExtends(Class c) {
        return c.Name +  (c.BaseClass != null ?  " extends " + c.BaseClass.Name : "");
    }

    string ConstructorAddExtends(Class c) {
        return c.BaseClass != null ?  "\r\n\tsuper(model);\r\n" : "";
    }

    static readonly string[] classesIn = 
            { "LoginInputModel", "ExternalProvider" };

    static readonly string[] classesOut = 
            { "ManageLoginsViewModel", "SendCodeViewModel", "ConfigureTwoFactorViewModel", "IndexViewModel", "LoggedOutViewModel", "LogoutViewModel" };

    static readonly Dictionary<string, string> validationDict = 
        new Dictionary<string, string>
        {
            { "EmailAddress", "@def.Validate(cust.IsEmail)" },
            { "StringLength", "@def.Validate(cust.Length, [{ min: {1}, max: {0} }])" },
            { "Compare", "@cust.IsEqualThan({0})" },
            { "Required", "@cust.Required()" }
        };

    string ImportOther(Class c) {        
        var ret = c.Properties.Any(a => a.Attributes.Select(s => s.Name).Intersect(validationDict.Select(ss => ss.Key)).Any())
            ? "import * as def from 'class-validator';\r\nimport * as cust from '../decorators/validators';\r\n" 
            : "";
        if (c.Name == "ComPortTypeDTO")
          ret = ret + "import { PortType } from './ComConfigModels';\r\n";
        return ret;
    }    

    string MapValidationAttributes(Attribute a) {
        var dict = validationDict.FirstOrDefault(f => f.Key == a.Name);
        var dictText = dict.Equals(default(KeyValuePair<string, string>)) ? string.Empty : $"\r\n\t{dict.Value}"; 
        var value = a.Value;
        var i = 0;
        while (dictText.Contains("{" + i.ToString() + "}")) {
            var first = "";
            if (value != null && value.IndexOf(",") != -1)
            {
                var comma = value.IndexOf(",");
                first = value.Substring(0,comma);
                var equal = first.IndexOf("= ");
                first = equal != -1 ? first.Substring(equal + 2) : first;
                value =value.Substring(comma + 1);
            }
            dictText = dictText.Replace("{" + i.ToString() + "}", first.ToLower());
            ++i;
        }
        return dictText;
    }

}$Enums(e => e.Name.EndsWith("PortType") || e.Name == "LanguageIso")[
export enum $Name {
    $Values[$Name = $Value][,
    ]    
}]
$Classes(c => 
    (c.Name.EndsWith("ViewModel") || c.Name.EndsWith("View") || c.Name.EndsWith("DTO") || classesIn.Contains(c.Name))
    && !classesOut.Contains(c.Name))[$ImportOther
export interface $InterfaceNameWithExtends {
    $Properties[$name: $Type;
    ]
}

export class $ClassNameWithExtends implements I$name {$Properties[$Attributes[$MapValidationAttributes]
    public $name: $Type;
    ]
    constructor(model?: I$name) {$ConstructorAddExtends
        if(model) {
            $Properties[this.$name = model.$name;
            ]
        }
    }
}
] 