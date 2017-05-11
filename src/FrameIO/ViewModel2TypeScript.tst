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
        return (c.BaseClass != null ?  "super(model);" : "");
    }

    string ImportOther(Class c) {
        return (c.Name == "ComPortTypeDTO" ? "import { PortType } from './ComConfigModels';" : "");
    }
}$Enums(c => c.Name.EndsWith("PortType"))[
export enum $Name {
    $Values[
    $Name = $Value][,]    
}]$Classes(c => c.Name.EndsWith("View") || c.Name.EndsWith("DTO"))[$ImportOther
export interface $InterfaceNameWithExtends {
    $Properties[$name: $Type;
    ]
}

export class $ClassNameWithExtends implements I$name {
    $Properties[public $name: $Type;
    ]
    constructor(model?: I$name) {
        $ConstructorAddExtends
        if(model) {
            $Properties[this.$name = model.$name;
            ]
        }
    }
}
]