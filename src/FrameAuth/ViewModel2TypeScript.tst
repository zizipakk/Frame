${
    Template(Settings settings) {
        settings.IncludeCurrentProject();
        settings.OutputFilenameFactory = file =>
        {
            return $"..\\FrameUI\\src\\app\\models\\{file.Name.Replace(".cs", ".ts")}"; //2.0 will be great for foreign project output
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
            { "ManageLoginsViewModel", "SendCodeViewModel", "ConfigureTwoFactorViewModel" };

    static readonly Dictionary<string, string> validationDict = 
        new Dictionary<string, string>
        {
            { "EmailAddress", "@def.IsEmail({ allow_display_name: true }, { message: 'This is not valid email!' })" },
            { "StringLength", "@def.Length(6, 200, { message: 'This is not valid password!' })" },
            { "Compare", "@cust.IsEqualThan('password', { message: 'This is not the same!' })" },
            { "Required", "@cust.Required({ message: 'This is required!' })" }
        };

    string ImportOther(Class c) {        
        return c.Properties.Any(a => a.Attributes.Select(s => s.Name).Intersect(validationDict.Select(ss => ss.Key)).Any())
            ? "import * as def from 'class-validator';\r\nimport * as cust from '../decorators/validators';\r\n" 
            : "";
    }    

    string MapValidationAttributes(Attribute a) {
        var dict = validationDict.FirstOrDefault(f => f.Key == a.Name);
        return dict.Equals(default(KeyValuePair<string, string>)) ? string.Empty : $"\r\n\t{dict.Value}"; 
    }
}$Classes(c => 
    (c.Name.EndsWith("ViewModel") || classesIn.Contains(c.Name))
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