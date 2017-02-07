﻿using AutoMapper;
using FrameAuth.Data;
using FrameAuth.Models.UserViewModels;
using System.Collections.Generic;

namespace FrameAuth.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ApplicationUser, UserViewModel>();
            CreateMap<List<ApplicationUser>, List<UserViewModel>>();
        }
    }
}
