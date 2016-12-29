${
    Template(Settings settings)
    {
        settings.IncludeCurrentProject();
        settings.OutputFilenameFactory = file =>
        {
            // return $"..\\FrameUI\\src\\app\\models\\{file.Name.Replace(".cs", ".ts")}" ; 2.0 will be great for foreign project outpu
            return $".\\Models\\TsModels\\{file.Name.Replace(".cs", ".ts")}" ;
        };
    }
}
$Classes(*ViewModel)[
    export interface I$name {
        $Properties[$name: $Type;
        ]
    }

    export class $Name {
        $Properties[public $name: $Type;
        ]
        constructor(model: I$name) {
            $Properties[this.$name = model.$name;
            ]
        }
    }
] 